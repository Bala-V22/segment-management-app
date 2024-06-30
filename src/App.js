import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [schemas, setSchemas] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState('');
  const [availableSchemas, setAvailableSchemas] = useState([
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' },
  ]);

  const handleSaveSegment = () => {
    const data = {
      segment_name: segmentName,
      schema: schemas.map(schema => ({ [schema.value]: schema.label })),
    };

    fetch('https://webhook.site/350d841f-eefa-4dc5-ab9d-4e1572c31cfc', {
  method: 'POST',
  mode: 'no-cors',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response;
  })
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));


    setIsPopupVisible(false);
  };

  const handleAddSchema = () => {
    if (selectedSchema) {
      const schema = availableSchemas.find(s => s.value === selectedSchema);
      setSchemas([...schemas, schema]);
      setAvailableSchemas(availableSchemas.filter(s => s.value !== selectedSchema));
      setSelectedSchema('');
    }
  };

  const handleRemoveSchema = (index) => {
    const removedSchema = schemas[index];
    setSchemas(schemas.filter((_, i) => i !== index));
    setAvailableSchemas([...availableSchemas, removedSchema]);
  };

  return (
    <div className="App">
      <h2>View Audience</h2>
      <button className="save-segment-button" onClick={() => setIsPopupVisible(true)}>Save segment</button>
      {isPopupVisible && (
        <div className="popup">
          <div className="popup-content">
            <h2>Saving Segment</h2>
            <div className='top-content'>
            <p>Enter name of the segment</p>
            <input
              type="text"
              placeholder="Name of the segment"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
            />
            <p>To save your segment, you need to add the schemas to build the query</p>
            </div>
            <div className={`schemas-container ${schemas.length > 0 ? 'with-border' : ''}`}>
              {schemas.map((schema, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                  <select
                    value={schema.value}
                    onChange={(e) => {
                      const newSchemaValue = e.target.value;
                      const newSchema = availableSchemas.find(s => s.value === newSchemaValue);
                      const updatedSchemas = schemas.map((s, i) => (i === index ? newSchema : s));
                      setSchemas(updatedSchemas);
                      setAvailableSchemas([
                        ...availableSchemas.filter(s => s.value !== newSchemaValue),
                        schemas[index],
                      ]);
                    }}
                  >
                    <option value={schema.value}>{schema.label}</option>
                    {availableSchemas.map((s, idx) => (
                      <option key={idx} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <button className="remove-schema-button" onClick={() => handleRemoveSchema(index)}>−</button>
                </div>
              ))}
            </div>
            <div className='select-schemas'>
              <select
                className="add-schema-select"
                value={selectedSchema}
                onChange={(e) => setSelectedSchema(e.target.value)}
              >
                <option value="">Add schema to segment</option>
                {availableSchemas.map((schema, index) => (
                  <option key={index} value={schema.value}>{schema.label}</option>
                ))}
              </select>
            <button className="add-schema-button" onClick={handleAddSchema}>+Add new schema</button>
            </div>
            <div className='bottom-buttons'>
              <button className="save-button" onClick={handleSaveSegment}>Save the Segment</button>
              <button className="cancel-button" onClick={() => setIsPopupVisible(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
