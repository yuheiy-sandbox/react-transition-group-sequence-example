'use strict';
const {EventEmitter} = require('events');
const React = require('react');
const TransitionGroup = require('react-addons-transition-group');
import PromisedReducer from 'promised-reducer';
const Page = require('../components/Page');
const HomePage = require('../components/page/Home');
const AboutPage = require('../components/page/About');
const WorkPage = require('../components/page/Work');

const matchURI = ({pathname}) => {
  switch (pathname) {
    case '/':
      return <HomePage />;
    case '/about':
      return <AboutPage />;
    case '/work':
      return <WorkPage />;
    default:
      return null;
  }
};

class PageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location
    };

    const reducer = new PromisedReducer();
    this._reducer = reducer;
    reducer.on(':update', state => this.setState(state));

    const emitter = new EventEmitter();
    this._emitter = emitter;
    this._dispatch = emitter.emit.bind(emitter);

    const subscribe = emitter.on.bind(emitter);
    subscribe(
      'push-queue',
      queue => reducer.update(state => queue().then(() => state))
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location) {
      this._reducer.update(() => ({location: nextProps.location}));
    }
  }

  render() {
    const {location} = this.state;
    const matchComponent = matchURI(location);

    return (
      <TransitionGroup component="div">
        <Page key={location.pathname} dispatch={this._dispatch}>
          {matchComponent}
        </Page>
      </TransitionGroup>
    );
  }
}

module.exports = PageContainer;
