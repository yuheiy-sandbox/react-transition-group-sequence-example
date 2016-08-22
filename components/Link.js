'use strict';
const React = require('react');
const history = require('../history');

const Link = function Link({to, children}) {
  const onClick = e => {
    e.preventDefault();
    history.push(to);
  };
  return <a href={to} onClick={onClick}>{children}</a>;
};

module.exports = Link;
