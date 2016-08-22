'use strict';
const React = require('react');
const Link = require('./Link');
const PageContainer = require('../containers/PageContainer');

const Header = function Header() {
  return (
    <header>
      <h1>Document</h1>
      <nav>
        <ul>
          {[
            ['home', '/'],
            ['about', '/about'],
            ['work', '/work']
          ].map(([name, path]) => (
            <li key={path}>
              <Link to={path}>{name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

const App = function App(props) {
  return (
    <div>
      <Header />
      <PageContainer location={props.location} />
    </div>
  );
};

module.exports = App;
