import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import AppContext from './AppContext';

function Provider({ children }) {
  const [dataContext, setDataContext] = useState(AppContext);

  const appContextConsumer = useMemo(() => ({
    dataContext,
    setDataContext,
  }), [dataContext]);

  return (
    <AppContext.Provider value={ appContextConsumer }>
      {children}
    </AppContext.Provider>
  );
}

Provider.propTypes = {
  children: PropTypes.objectOf(Object).isRequired,
};

export default Provider;
