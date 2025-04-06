import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { 
  FaCalculator, 
  FaCog, 
  FaCalendarAlt, 
  FaPencilAlt, 
  FaTrashAlt, 
  FaArrowRight,
  FaPlus,
  FaDice
} from 'react-icons/fa';
import SimulationControls from './SimulationControls';
import SimulationHistory from './PastSimulations';
import '../styles/GroupCreation.css';
import LifeSmartLogo from '../../assets/icons/LifeSmartLogo.png';

Chart.register(ArcElement, Tooltip, Legend, Title);

const GroupCreation = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showSimulationControls, setShowSimulationControls] = useState(false);
  const [showSimulationHistory, setShowSimulationHistory] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [currentSimulationIndex, setCurrentSimulationIndex] = useState(null);
  const [maxPortfolioValue, setMaxPortfolioValue] = useState(100000);
  const [roundTo, setRoundTo] = useState(5000);
  const [enableRandomGeneration, setEnableRandomGeneration] = useState(true);
  const [groups, setGroups] = useState([
    { name: 'Group 1', equity: '', bonds: '', realestate: '', commodities: '', other: '', equityTemp: '', bondsTemp: '', realestateTemp: '', commoditiesTemp: '', otherTemp: '' },
    { name: 'Group 2', equity: '', bonds: '', realestate: '', commodities: '', other: '', equityTemp: '', bondsTemp: '', realestateTemp: '', commoditiesTemp: '', otherTemp: '' },
    { name: 'Group 3', equity: '', bonds: '', realestate: '', commodities: '', other: '', equityTemp: '', bondsTemp: '', realestateTemp: '', commoditiesTemp: '', otherTemp: '' },
    { name: 'Group 4', equity: '', bonds: '', realestate: '', commodities: '', other: '', equityTemp: '', bondsTemp: '', realestateTemp: '', commoditiesTemp: '', otherTemp: '' }
  ]);
  const chartsRef = useRef([]);

  const toggleCalculator = () => {
    navigate('/investment-calculator');
  };

  const toggleSimulationControls = () => {
    setShowSimulationControls(!showSimulationControls);
  };

  const toggleSimulationHistory = () => {
    setShowSimulationHistory(!showSimulationHistory);
    setCurrentSimulationIndex(null);
  };

  const handleViewSimulationDetails = (simulationIndex) => {
    setCurrentSimulationIndex(simulationIndex);
    setShowSimulationHistory(false);
  };

  const addGroup = () => {
    setShowModal(true);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const confirmAddGroup = () => {
    if (newGroupName.trim()) {
      setGroups([...groups, {
        name: newGroupName.trim(),
        equity: '', bonds: '', realestate: '', commodities: '', other: '',
        equityTemp: '', bondsTemp: '', realestateTemp: '', commoditiesTemp: '', otherTemp: ''
      }]);
      setNewGroupName('');
      toggleModal();
    } else {
      alert('Please enter a group name.');
    }
  };

  const editGroupName = (index) => {
    const newName = prompt("Enter new group name:", groups[index].name);
    if (newName && newName.trim() !== '') {
      const newGroups = [...groups];
      newGroups[index].name = newName.trim();
      setGroups(newGroups);
    }
  };

  const removeGroup = (index) => {
    const newGroups = groups.filter((_, i) => i !== index);
    setGroups(newGroups);
    if (chartsRef.current[index]) {
      chartsRef.current[index].destroy();
      chartsRef.current = chartsRef.current.filter((_, i) => i !== index);
    }
  };

  const updateGroupValue = (index, field) => {
    const newGroups = [...groups];
    newGroups[index][field] = newGroups[index][`${field}Temp`];
    setGroups(newGroups);
    updatePieChart(index);
  };

  const updateAllGroupValues = (index) => {
    const newGroups = [...groups];
    const fields = ['equity', 'bonds', 'realestate', 'commodities', 'other'];
    fields.forEach(field => {
      newGroups[index][field] = newGroups[index][`${field}Temp`];
    });
    setGroups(newGroups);
    updatePieChart(index);
  };

  const getTotalValue = (group) => {
    return Object.keys(group).reduce((total, key) => {
      if (key !== 'name' && !key.endsWith('Temp')) {
        total += parseFloat(group[key]) || 0;
      }
      return total;
    }, 0);
  };

  const renderPieChart = (index) => {
    const group = groups[index];
    const canvasId = `pieChart_${index}`;
    const canvas = document.getElementById(canvasId);
    
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    if (chartsRef.current[index]) {
      chartsRef.current[index].destroy();
    }

    const data = {
      labels: ['Equity', 'Bonds', 'Real Estate', 'Commodities', 'Other'],
      datasets: [{
        label: `${group.name} Asset Allocation`,
        data: [group.equity, group.bonds, group.realestate, group.commodities, group.other],
        backgroundColor: [
          'rgba(114, 93, 255, 1)',
          'rgba(230, 96, 131, 1)',
          'rgba(255, 133, 76, 1)',
          'rgba(30, 174, 174, 1)',
          'rgba(54, 48, 82, 1)'
        ],
        borderColor: [
          'rgba(114, 93, 255, 1)',
          'rgba(230, 96, 131, 1)',
          'rgba(255, 133, 76, 1)',
          'rgba(30, 174, 174, 1)',
          'rgba(54, 48, 82, 1)'
        ],
        borderWidth: 1
      }]
    };

    chartsRef.current[index] = new Chart(ctx, {
      type: 'pie',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: '#000',
              font: {
                size: 10,
                family: 'Helvetica'
              },
              boxWidth: 20,
              usePointStyle: true
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
        },
        cutout: '65%'
      }
    });
  };

  const updatePieChart = (index) => {
    renderPieChart(index);
  };

  const generateRandomValues = (index) => {
    if (!enableRandomGeneration) return;
    
    const newGroups = [...groups];
    const fields = ['equityTemp', 'bondsTemp', 'realestateTemp', 'commoditiesTemp', 'otherTemp'];
    
    let remainingValue = maxPortfolioValue;
    const values = [];
    
    for (let i = 0; i < 4; i++) {
      const max = remainingValue - (4 - i) * 1000;
      const value = Math.floor(Math.random() * max) + 1000;
      values.push(value);
      remainingValue -= value;
    }
    values.push(remainingValue);
    
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }
    
    fields.forEach((field, i) => {
      newGroups[index][field] = values[i].toString();
    });
    
    setGroups(newGroups);
  };

  useEffect(() => {
    groups.forEach((_, index) => {
      renderPieChart(index);
    });
  }, []);

  if (isLoading) {
    return <div className="GroupCreation-loading">Loading...</div>;
  }

  return (
    <div className="GroupCreation-dashboard">
      <header className="GroupCreation-header">
        <button 
          onClick={() => navigate('/select')} 
          className="GroupCreation-logo-button"
        >
          <img src={LifeSmartLogo} alt="LifeSmart Logo" className="GroupCreation-logo" />
        </button>
        <div className="GroupCreation-header-icons">
          <button onClick={toggleCalculator} className="GroupCreation-calculator-toggle">
            <FaCalculator />
          </button>
          <button onClick={toggleSimulationControls} className="GroupCreation-simulation-controls-toggle">
            <FaCog />
          </button>
          <button onClick={toggleSimulationHistory} className="GroupCreation-simulation-history-toggle">
            <FaCalendarAlt />
          </button>
        </div>
      </header>

      {showSimulationControls && <SimulationControls />}
      {showSimulationHistory && <SimulationHistory onViewSimulationDetails={handleViewSimulationDetails} />}

      <main>
        {!currentSimulationIndex && (
          <>
            <div className="GroupCreation-settings">
              <div className="GroupCreation-settings-group">
                <label htmlFor="max-value-input">Max Portfolio Value:</label>
                <input
                  id="max-value-input"
                  type="number"
                  value={maxPortfolioValue}
                  onChange={(e) => setMaxPortfolioValue(Number(e.target.value))}
                  className="GroupCreation-modern-input"
                  step="5000"
                />
                <label htmlFor="round-to-input">Round Up To:</label>
                <input
                  id="round-to-input"
                  type="number"
                  value={roundTo}
                  onChange={(e) => setRoundTo(Number(e.target.value))}
                  className="GroupCreation-modern-input"
                  step="1000"
                />
              </div>
              <div className="GroupCreation-settings-group">
                <label className="GroupCreation-toggle-label">
                  <input
                    type="checkbox"
                    checked={enableRandomGeneration}
                    onChange={(e) => setEnableRandomGeneration(e.target.checked)}
                    className="GroupCreation-toggle-input"
                  />
                  <span className="GroupCreation-toggle-text">Enable Random Generation</span>
                </label>
              </div>
            </div>

            <h1 className="GroupCreation-header-content">
              <span>Group Management</span>
            </h1>

            <div className="GroupCreation-groups">
              {groups.map((group, index) => (
                <div key={index} className="GroupCreation-group">
                  <div className="GroupCreation-group-header">
                    <h2>{group.name}</h2>
                    <div className="GroupCreation-button-group">
                      <button 
                        onClick={() => generateRandomValues(index)} 
                        className="GroupCreation-random-btn"
                        title="Generate Random Values"
                        disabled={!enableRandomGeneration}
                      >
                        <FaDice />
                      </button>
                      <button onClick={() => editGroupName(index)} className="GroupCreation-edit-group-btn">
                        <FaPencilAlt />
                      </button>
                      <button onClick={() => removeGroup(index)} className="GroupCreation-remove-group-btn">
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                  <div className="GroupCreation-group-content">
                    <div className="GroupCreation-inputs">
                      <div className="GroupCreation-input-row">
                        <label htmlFor={`equity-${index}`}>Equity:</label>
                        <input
                          type="number"
                          value={group.equityTemp}
                          onChange={(e) => {
                            const newGroups = [...groups];
                            newGroups[index].equityTemp = e.target.value;
                            setGroups(newGroups);
                          }}
                          id={`equity-${index}`}
                          className="GroupCreation-modern-input"
                        />
                      </div>
                      <div className="GroupCreation-input-row">
                        <label htmlFor={`bonds-${index}`}>Bonds:</label>
                        <input
                          type="number"
                          value={group.bondsTemp}
                          onChange={(e) => {
                            const newGroups = [...groups];
                            newGroups[index].bondsTemp = e.target.value;
                            setGroups(newGroups);
                          }}
                          id={`bonds-${index}`}
                          className="GroupCreation-modern-input"
                        />
                      </div>
                      <div className="GroupCreation-input-row">
                        <label htmlFor={`realestate-${index}`}>Real Estate:</label>
                        <input
                          type="number"
                          value={group.realestateTemp}
                          onChange={(e) => {
                            const newGroups = [...groups];
                            newGroups[index].realestateTemp = e.target.value;
                            setGroups(newGroups);
                          }}
                          id={`realestate-${index}`}
                          className="GroupCreation-modern-input"
                        />
                      </div>
                      <div className="GroupCreation-input-row">
                        <label htmlFor={`commodities-${index}`}>Commodities:</label>
                        <input
                          type="number"
                          value={group.commoditiesTemp}
                          onChange={(e) => {
                            const newGroups = [...groups];
                            newGroups[index].commoditiesTemp = e.target.value;
                            setGroups(newGroups);
                          }}
                          id={`commodities-${index}`}
                          className="GroupCreation-modern-input"
                        />
                      </div>
                      <div className="GroupCreation-input-row">
                        <label htmlFor={`other-${index}`}>Other:</label>
                        <input
                          type="number"
                          value={group.otherTemp}
                          onChange={(e) => {
                            const newGroups = [...groups];
                            newGroups[index].otherTemp = e.target.value;
                            setGroups(newGroups);
                          }}
                          id={`other-${index}`}
                          className="GroupCreation-modern-input"
                        />
                      </div>
                      <div className="GroupCreation-total-value">
                        Total Portfolio Value: ${getTotalValue(group).toFixed(2)}
                      </div>
                      <button onClick={() => updateAllGroupValues(index)} className="GroupCreation-modern-button GroupCreation-enter-all-btn">
                        Enter All
                      </button>
                    </div>
                    <div className="GroupCreation-pie-chart-container">
                      <canvas id={`pieChart_${index}`}></canvas>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addGroup} className="GroupCreation-add-group-btn">
                <FaPlus /> Add Group
              </button>
            </div>

            <button 
              className="GroupCreation-modern-button"
              onClick={() => {
                // Validate that all groups have values before proceeding
                const hasEmptyValues = groups.some(group => {
                  return !group.equity || !group.bonds || !group.realestate || !group.commodities || !group.other;
                });

                if (hasEmptyValues) {
                  alert('Please fill in all values for each group before starting the simulation.');
                  return;
                }

                // Navigate to simulation page with groups data
                navigate('/simulation-page', { 
                  state: { 
                    groups,
                    maxPortfolioValue,
                    roundTo
                  }
                });
              }}
            >
              Start Simulation
              <FaArrowRight style={{ marginLeft: '5px' }} />
            </button>
          </>
        )}
      </main>

      {showModal && (
        <div className="GroupCreation-modal">
          <div className="GroupCreation-modal-content">
            <span className="GroupCreation-close" onClick={toggleModal}>&times;</span>
            <h3>Add a new group</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              confirmAddGroup();
            }}>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter group name"
                required
                autoFocus
              />
              <button onClick={confirmAddGroup}>Confirm</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupCreation; 