import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Chart } from 'chart.js/auto';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, db, auth } from '../../firebase/initFirebase';
import '../styles/Simulation.css';
import lifesmartlogo from '../../assets/icons/LifeSmartLogo.png';

// Custom hook for chart management
const useChart = (groups, simulationYears, fixedColors) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const destroyChart = useCallback(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }
  }, []);

  const calculateYAxisScale = useCallback((data) => {
    // Find the minimum and maximum values across all groups
    const allValues = data.flatMap(group => group.totalPortfolioValues.quarters);
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);

    // Add padding to the scale (10% of the range)
    const range = maxValue - minValue;
    const padding = range * 0.1;

    return {
      min: Math.max(0, minValue - padding),
      max: maxValue + padding
    };
  }, []);

  const initializeChart = useCallback(() => {
    // Destroy existing chart before creating a new one
    destroyChart();

    const canvasElement = document.getElementById('portfolioChart');
    if (!canvasElement) return;

    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;

    const labels = ['Initial Value', ...Array.from({ length: simulationYears * 4 }, (_, i) => `Q${i + 1}`)];
    
    const datasets = groups.map((group, index) => ({
      label: `${group.icon} ${group.name}`,
      data: [...group.totalPortfolioValues.quarters],
      borderColor: fixedColors[index % fixedColors.length],
      fill: false,
      cubicInterpolationMode: 'monotone',
      tension: 0.4,
      borderDash: index > 5 ? [5, 5] : [],
      icon: group.icon
    }));

    const yAxisScale = calculateYAxisScale(groups);

    const chartConfig = {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { size: 18, weight: 'bold' },
              color: '#333',
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
              generateLabels: function(chart) {
                const datasets = chart.data.datasets;
                return datasets.map((dataset, i) => ({
                  text: dataset.label,
                  fillStyle: dataset.borderColor,
                  strokeStyle: dataset.borderColor,
                  lineWidth: 2,
                  pointStyle: 'circle',
                  hidden: false,
                  index: i
                }));
              }
            },
          },
          title: {
            display: true,
            text: 'Total Portfolio Value Over Time',
          },
          tooltip: {
            enabled: true,
            titleFont: { size: 18 },
            bodyFont: { size: 16 },
            footerFont: { size: 14 },
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: £${context.parsed.y.toLocaleString()}`;
              }
            }
          },
        },
        scales: {
          x: { 
            grid: { display: false },
            ticks: {
              font: { size: 14 }
            }
          },
          y: {
            min: yAxisScale.min,
            max: yAxisScale.max,
            ticks: {
              callback: function(value) {
                return '£' + value.toLocaleString();
              },
              font: { size: 14 }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
              drawBorder: false
            }
          }
        },
        maintainAspectRatio: true,
        animation: false,
        transitions: {
          active: {
            animation: {
              duration: 750
            }
          }
        },
        elements: {
          line: {
            tension: 0.4
          },
          point: {
            radius: 20,
            hoverRadius: 22,
            backgroundColor: 'white',
            borderWidth: 2,
            borderColor: function(context) {
              return context.dataset.borderColor;
            },
            drawActiveBackground: false,
            pointStyle: function(context) {
              // Create an off-screen canvas for the point
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              const radius = 20; // Use fixed radius instead of context.options.radius
              const size = radius * 2;
              canvas.width = size;
              canvas.height = size;

              // Draw white circle background
              ctx.beginPath();
              ctx.arc(size/2, size/2, radius - 2, 0, Math.PI * 2); // Use fixed borderWidth of 2
              ctx.fillStyle = 'white';
              ctx.fill();

              // Draw border
              ctx.strokeStyle = context.dataset.borderColor;
              ctx.lineWidth = 2;
              ctx.stroke();

              // Draw emoji
              ctx.font = '20px Arial';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = 'black';
              ctx.fillText(context.dataset.icon, size/2, size/2);

              return canvas;
            }
          }
        }
      },
    };

    chartInstanceRef.current = new Chart(ctx, chartConfig);

    // Enable animations after initial render
    chartInstanceRef.current.options.animation = {
      duration: 750,
      easing: 'linear'
    };
  }, [groups, simulationYears, fixedColors, destroyChart, calculateYAxisScale]);

  const updateChart = useCallback(() => {
    if (!chartInstanceRef.current) return;

    const labels = ['Initial Value', ...Array.from({ length: simulationYears * 4 }, (_, i) => `Q${i + 1}`)];
    
    const datasets = groups.map((group, index) => ({
      label: `${group.icon} ${group.name}`,
      data: [...group.totalPortfolioValues.quarters],
      borderColor: fixedColors[index % fixedColors.length],
      fill: false,
      cubicInterpolationMode: 'monotone',
      tension: 0.4,
      borderDash: index > 5 ? [5, 5] : [],
      icon: group.icon
    }));

    const yAxisScale = calculateYAxisScale(groups);

    chartInstanceRef.current.data.labels = labels;
    chartInstanceRef.current.data.datasets = datasets;
    chartInstanceRef.current.options.scales.y.min = yAxisScale.min;
    chartInstanceRef.current.options.scales.y.max = yAxisScale.max;
    
    chartInstanceRef.current.update('active');
  }, [groups, simulationYears, fixedColors, calculateYAxisScale]);

  useEffect(() => {
    initializeChart();
    return () => {
      destroyChart();
    };
  }, [initializeChart, destroyChart]);

  return { updateChart, chartRef };
};

// Custom hook for simulation state
const useSimulation = (groups, assetChanges, simulationYears, setGroups, simulationSpeed) => {
  const [currentQuarterIndex, setCurrentQuarterIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [allQuarters, setAllQuarters] = useState([]);
  const simulationRef = useRef(null);
  const pausedRef = useRef(false);
  const calculatedQuartersRef = useRef([]);

  const calculateAllQuarters = useCallback(() => {
    const totalQuarters = simulationYears * 4;
    const quarters = ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'];
    const calculatedQuarters = [];

    // Initialize with current values
    calculatedQuarters.push(groups);

    // Calculate all quarters upfront
    for (let quarterIndex = 0; quarterIndex < totalQuarters; quarterIndex++) {
      const year = Math.floor(quarterIndex / 4);
      const quarter = quarterIndex % 4;
      const currentQuarter = quarters[quarter];
      const assetChangesForQuarter = assetChanges[year]?.[currentQuarter];

      if (!assetChangesForQuarter) continue;

      const updatedGroups = calculatedQuarters[quarterIndex].map(group => {
        let totalValue = 0;
        const newQuarterlyValues = {
          equity: [...group.quarterlyValues.equity],
          bonds: [...group.quarterlyValues.bonds],
          realestate: [...group.quarterlyValues.realestate],
          commodities: [...group.quarterlyValues.commodities],
          other: [...group.quarterlyValues.other]
        };

        // Calculate new values for each asset type
        Object.keys(assetChangesForQuarter).forEach(assetType => {
          const growthRate = assetChangesForQuarter[assetType] / 100;
          const assetKey = assetType.toLowerCase();
          const currentValue = newQuarterlyValues[assetKey][quarterIndex];
          const newValue = currentValue * (1 + growthRate);
          newQuarterlyValues[assetKey] = [...newQuarterlyValues[assetKey].slice(0, quarterIndex + 1), newValue];
          totalValue += newValue;
        });

        return {
          ...group,
          quarterlyValues: newQuarterlyValues,
          totalPortfolioValues: {
            ...group.totalPortfolioValues,
            quarters: [...group.totalPortfolioValues.quarters.slice(0, quarterIndex + 1), totalValue]
          }
        };
      });

      calculatedQuarters.push(updatedGroups);
    }

    calculatedQuartersRef.current = calculatedQuarters;
    setAllQuarters(calculatedQuarters);
  }, [groups, assetChanges, simulationYears]);

  useEffect(() => {
    calculateAllQuarters();
    return () => {
      if (simulationRef.current) {
        clearTimeout(simulationRef.current);
      }
    };
  }, [calculateAllQuarters]);

  const nextQuarter = useCallback(() => {
    const nextIndex = currentQuarterIndex + 1;
    if (nextIndex >= calculatedQuartersRef.current.length) {
      setIsSimulating(false);
      return;
    }

    setCurrentQuarterIndex(nextIndex);
    setGroups(calculatedQuartersRef.current[nextIndex]);
  }, [currentQuarterIndex, setGroups]);

  const runFullSimulation = useCallback(() => {
    if (isSimulating) return;
    
    pausedRef.current = false;
    setIsSimulating(true);

    const runNextQuarter = () => {
      if (pausedRef.current) {
        return;
      }

      setCurrentQuarterIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= calculatedQuartersRef.current.length) {
          setIsSimulating(false);
          return prevIndex;
        }
        setGroups(calculatedQuartersRef.current[nextIndex]);
        simulationRef.current = setTimeout(runNextQuarter, simulationSpeed);
        return nextIndex;
      });
    };

    runNextQuarter();
  }, [isSimulating, simulationSpeed, setGroups]);

  const pauseSimulation = useCallback(() => {
    pausedRef.current = true;
    setIsSimulating(false);
    if (simulationRef.current) {
      clearTimeout(simulationRef.current);
      simulationRef.current = null;
    }
  }, []);

  return {
    currentQuarterIndex,
    isSimulating,
    nextQuarter,
    setIsSimulating: pauseSimulation,
    runFullSimulation
  };
};

const AVAILABLE_ICONS = [
  '🏢', '🏦', '🏪', '🏭', '🏨', '🏫', '🏛️', '🏰', '🏯', '🏣',
  '🚀', '💼', '💎', '💰', '📈', '📊', '🎯', '🎲', '🎮', '🎨'
];

const Simulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [uid, setUid] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latestSimulationIndex, setLatestSimulationIndex] = useState(null);
  const [groups, setGroups] = useState([]);
  const [simulationYears, setSimulationYears] = useState(1);
  const [assetChanges, setAssetChanges] = useState([]);
  const [simulationSpeed, setSimulationSpeed] = useState(750);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(null);

  const fixedColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#8B0000', '#00FF7F', '#FFD700', '#4682B4'
  ];

  const { updateChart, chartRef } = useChart(groups, simulationYears, fixedColors);
  const {
    currentQuarterIndex,
    isSimulating,
    nextQuarter,
    setIsSimulating,
    runFullSimulation
  } = useSimulation(groups, assetChanges, simulationYears, setGroups, simulationSpeed);

  const handleIconSelect = (icon) => {
    if (selectedGroupIndex === null) return;
    
    setGroups(prevGroups => {
      const newGroups = [...prevGroups];
      newGroups[selectedGroupIndex] = {
        ...newGroups[selectedGroupIndex],
        icon: icon
      };
      return newGroups;
    });
    
    setShowIconSelector(false);
    setSelectedGroupIndex(null);
  };

  const fetchLatestSimulationIndex = async (userId) => {
    try {
      const db = getFirestore();
      const simulationsRef = collection(db, userId, "Asset Market Simulations", "Simulations");
      const querySnapshot = await getDocs(simulationsRef);
      return querySnapshot.empty ? 1 : querySnapshot.size;
    } catch (error) {
      console.error("Error fetching simulation index:", error);
      setError("Failed to fetch simulation data. Please check your internet connection.");
      return 1;
    }
  };

  const fetchAssetChanges = async (userId, index) => {
    try {
      const db = getFirestore();
      const docRef = doc(db, 'Quiz', 'Asset Market Simulations', 'Simulations', `Simulation ${index}`, 'Simulation Controls', 'Controls');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAssetChanges(data.assetChanges);
        setSimulationYears(data.years || 1);
      }
    } catch (error) {
      console.error("Error fetching asset changes:", error);
      setError("Failed to fetch simulation data. Please check your internet connection.");
    }
  };

  useEffect(() => {
    const auth = getAuth();
    setIsLoading(true);
    setError(null);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setUid(user.uid);
          
          if (location.state) {
            const { groups: passedGroups } = location.state;
            const transformedGroups = passedGroups.map((group, index) => ({
              id: group.name,
              name: group.name,
              icon: group.icon || AVAILABLE_ICONS[index % AVAILABLE_ICONS.length],
              initialValues: {
                equity: parseFloat(group.equity) || 0,
                bonds: parseFloat(group.bonds) || 0,
                realestate: parseFloat(group.realestate) || 0,
                commodities: parseFloat(group.commodities) || 0,
                other: parseFloat(group.other) || 0
              },
              quarterlyValues: {
                equity: [parseFloat(group.equity) || 0],
                bonds: [parseFloat(group.bonds) || 0],
                realestate: [parseFloat(group.realestate) || 0],
                commodities: [parseFloat(group.commodities) || 0],
                other: [parseFloat(group.other) || 0]
              },
              totalPortfolioValues: {
                initial: Object.values({
                  equity: parseFloat(group.equity) || 0,
                  bonds: parseFloat(group.bonds) || 0,
                  realestate: parseFloat(group.realestate) || 0,
                  commodities: parseFloat(group.commodities) || 0,
                  other: parseFloat(group.other) || 0
                }).reduce((acc, val) => acc + val, 0),
                quarters: [Object.values({
                  equity: parseFloat(group.equity) || 0,
                  bonds: parseFloat(group.bonds) || 0,
                  realestate: parseFloat(group.realestate) || 0,
                  commodities: parseFloat(group.commodities) || 0,
                  other: parseFloat(group.other) || 0
                }).reduce((acc, val) => acc + val, 0)]
              }
            }));
            
            setGroups(transformedGroups);
          }

          const index = await fetchLatestSimulationIndex(user.uid);
          setLatestSimulationIndex(index);
          if (index) {
            await fetchAssetChanges(user.uid, index);
          }
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
        setError("Failed to initialize simulation. Please check your internet connection.");
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate, location.state]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading simulation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="simulationpage-modern-button">
          Retry
        </button>
      </div>
    );
  }

  const finishSimulation = async () => {
    try {
      const finalValues = groups.map(group => ({
        name: group.name,
        equity: group.quarterlyValues.equity[group.quarterlyValues.equity.length - 1],
        bonds: group.quarterlyValues.bonds[group.quarterlyValues.bonds.length - 1],
        realestate: group.quarterlyValues.realestate[group.quarterlyValues.realestate.length - 1],
        commodities: group.quarterlyValues.commodities[group.quarterlyValues.commodities.length - 1],
        other: group.quarterlyValues.other[group.quarterlyValues.other.length - 1],
      }));

      const quarterResults = groups.map(group => ({
        name: group.name,
        equity: group.quarterlyValues.equity,
        bonds: group.quarterlyValues.bonds,
        realestate: group.quarterlyValues.realestate,
        commodities: group.quarterlyValues.commodities,
        other: group.quarterlyValues.other,
      }));

      const db = getFirestore();
      await setDoc(doc(db, uid, 'Asset Market Simulations', 'Simulations', 'Simulation 1', "Results", "Final"), { finalValues });
      await setDoc(doc(db, uid, 'Asset Market Simulations', 'Simulations', 'Simulation 1', "Results", "Quarters"), { quarterResults });
      
      // Pass the data directly to the results screen
      navigate('/results', {
        state: {
          teams: groups.map(g => g.name),
          teamData: finalValues.reduce((acc, val) => {
            acc[val.name] = {
              savings: 0, // Add if you have this data
              investments: [{
                currentValue: val.equity + val.bonds + val.realestate + val.commodities + val.other
              }],
              debt: 0, // Add if you have this data
              equity: val.equity,
              bonds: val.bonds,
              realestate: val.realestate,
              commodities: val.commodities,
              other: val.other
            };
            return acc;
          }, {}),
          quarterResults: quarterResults,
          quizScores: {} // Add if you have quiz scores
        }
      });
    } catch (error) {
      console.error("Error saving simulation results:", error);
      setError("Failed to save simulation results. Please check your internet connection.");
    }
  };

  return (
    <div>
      <header className="simulationpage-header">
        <img src={lifesmartlogo} alt="Logo" className="simulationpage-logo" />
      </header>

      <div className="simulationpage-sim-chart-container">
        <canvas id="portfolioChart" ref={chartRef}></canvas>
        
        <div className="team-icons-container">
          {groups.map((group, index) => (
            <div 
              key={group.id} 
              className="team-icon-wrapper"
              onClick={() => {
                setSelectedGroupIndex(index);
                setShowIconSelector(true);
              }}
            >
              <span className="team-icon">{group.icon}</span>
              <span className="team-name">{group.name}</span>
            </div>
          ))}
        </div>

        {showIconSelector && (
          <div className="icon-selector-modal">
            <div className="icon-selector-content">
              <h3>Select Icon for {groups[selectedGroupIndex]?.name}</h3>
              <div className="icon-grid">
                {AVAILABLE_ICONS.map((icon, index) => (
                  <button
                    key={index}
                    className="icon-button"
                    onClick={() => handleIconSelect(icon)}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <button 
                className="close-button"
                onClick={() => {
                  setShowIconSelector(false);
                  setSelectedGroupIndex(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <button 
          onClick={nextQuarter} 
          className="simulationpage-modern-button"
          disabled={currentQuarterIndex >= simulationYears * 4 || isSimulating}
        >
          Next Quarter
        </button>
        <button 
          onClick={runFullSimulation} 
          className="simulationpage-modern-button"
          disabled={isSimulating || currentQuarterIndex >= simulationYears * 4}
        >
          Run Full Simulation
        </button>
        {isSimulating ? (
          <button 
            onClick={setIsSimulating} 
            className="simulationpage-modern-button"
          >
            Pause Simulation
          </button>
        ) : currentQuarterIndex > 0 && currentQuarterIndex < simulationYears * 4 ? (
          <button 
            onClick={runFullSimulation} 
            className="simulationpage-modern-button"
          >
            Resume Simulation
          </button>
        ) : null}
        <input 
          type="number" 
          value={simulationSpeed} 
          onChange={(e) => setSimulationSpeed(Number(e.target.value))}
          min="100" 
          step="100" 
          title="Simulation Speed (ms)"
          className="simulationpage-input"
        />
      </div>

      <button onClick={finishSimulation} className="simulationpage-modern-button">
        Finish Simulation
      </button>
    </div>
  );
};

export default Simulation; 