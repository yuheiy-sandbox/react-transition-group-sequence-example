'use strict';
const React = require('react');
const dynamics = require('dynamics.js');

class WorkPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {
        display: 'none',
        opacity: 0
      }
    };
  }

  _fadeIn() {
    return new Promise(done => {
      const nextStyle = {...this.state.style};
      nextStyle.display = '';
      dynamics.animate(nextStyle, {
        opacity: 1
      }, {
        duration: 3000,
        change: style => this.setState({style}),
        complete: done
      });
    });
  }

  _fadeOut() {
    return new Promise(done => {
      const nextStyle = {...this.state.style};
      dynamics.animate(nextStyle, {
        opacity: 0
      }, {
        duration: 3000,
        change: style => this.setState({style}),
        complete: done
      });
    });
  }

  componentWillAppear(callback) {
    const queue = () => this._fadeIn().then(callback);
    this.props.dispatch('push-queue', queue);
  }

  componentWillEnter(callback) {
    // 前のコンポーネントの `componentWillLeave` を待ってから実行する
    setTimeout(() => {
      const queue = () => this._fadeIn().then(callback);
      this.props.dispatch('push-queue', queue);
    }, 0);
  }

  componentWillLeave(callback) {
    const queue = () => this._fadeOut().then(callback);
    this.props.dispatch('push-queue', queue);
  }

  render() {
    const {style} = this.state;
    return (
      <div style={{
        display: style.display,
        opacity: style.opacity
      }}>
        <section>
          <h1>Work</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </section>
      </div>
    );
  }
}

module.exports = WorkPage;
