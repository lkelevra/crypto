/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import GeneralContext from './src/context/GeneralContext';
import Routes from './src/routes';

const App = () => {

  return (<GeneralContext>
            <Routes />
          </GeneralContext>);
};

export default App;
