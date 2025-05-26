import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './ViewDistributions.css'; //  Import the CSS file

function ViewDistributions() {
  const [entriesByAgent, setEntriesByAgent] = useState({});
  const [agentInfo, setAgentInfo] = useState({});
  const [selectedAgent, setSelectedAgent] = useState(null);

  useEffect(() => {
    const fetchDistributions = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;

      try {
        const response = await axios.get('https://backend-task-management-app-35j9.onrender.com/api/lists/distributions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const groupedByAgent = {};
        const agentDetails = {};

        for (const fileName in response.data) {
          const agents = response.data[fileName];
          for (const agentName in agents) {
            if (!groupedByAgent[agentName]) groupedByAgent[agentName] = [];

            agents[agentName].forEach((entry) => {
              groupedByAgent[agentName].push({
                ...entry,
                fileName,
              });

              if (!agentDetails[agentName]) {
                agentDetails[agentName] = {
                  name: agentName,
                  email: entry.email || 'N/A',
                  mobile: entry.agentMobile || 'N/A',
                };
              }
            });
          }
        }

        setEntriesByAgent(groupedByAgent);
        setAgentInfo(agentDetails);
      } catch (error) {
        alert('Error fetching distributions');
        console.error(error);
      }
    };

    fetchDistributions();
  }, []);

  return (
    <div>
      <Navbar />
      <h2 className="distributions-container"> Agent Task Distribution</h2>
      <div className="distributions-layout">
        <div className="agent-list">
          <h3> Agents</h3>
          <ul>
            {Object.keys(entriesByAgent).map((agentName) => (
              <li
                key={agentName}
                className={selectedAgent === agentName ? 'selected' : ''}
                onClick={() => setSelectedAgent(agentName)}
              >
                {agentName}
              </li>
            ))}
          </ul>
        </div>

        <div className="task-panel">
          {selectedAgent ? (
            <>
              <h3> Tasks for {selectedAgent}</h3>
              <div className="agent-info-box">
                <p><strong> Email:</strong> {agentInfo[selectedAgent]?.email}</p>
                <p><strong> Phone:</strong> {agentInfo[selectedAgent]?.mobile}</p>
                <p><strong> Total Tasks:</strong> {entriesByAgent[selectedAgent]?.length}</p>
              </div>
              {entriesByAgent[selectedAgent].map((entry, idx) => (
                <div key={idx} className="task-card">
                  <p><strong> File:</strong> {entry.fileName}</p>
                  <p><strong> Notes:</strong> {entry.notes || 'N/A'}</p>
                  <button onClick={() => alert(JSON.stringify(entry, null, 2))}>View</button>
                </div>
              ))}
            </>
          ) : (
            <p>Select an agent to view their assigned tasks.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewDistributions;
