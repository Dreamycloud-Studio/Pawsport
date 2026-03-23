import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import Home from './pages/Home';
import TravelPlanner from './pages/TravelPlanner';
import Community from './pages/Community';
import ComponentShowcase from './pages/ComponentShowcase';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/travel-planner" component={TravelPlanner} />
          <Route path="/community" component={Community} />
          <Route path="/showcase" component={ComponentShowcase} />
          <ProtectedRoute path="/profile" component={Profile} />
        </Switch>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;