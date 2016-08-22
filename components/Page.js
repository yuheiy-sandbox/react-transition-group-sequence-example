'use strict';
const React = require('react');
const dynamics = require('dynamics.js');

class Page extends React.Component {
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
        {this.props.children}
      </div>
    );
  }
}

module.exports = Page;
