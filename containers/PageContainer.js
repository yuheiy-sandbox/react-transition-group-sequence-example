'use strict';
const {EventEmitter} = require('events');
const React = require('react');
const TransitionGroup = require('react-addons-transition-group');
import PromisedReducer from 'promised-reducer';
const HomePage = require('../components/page/Home');
const AboutPage = require('../components/page/About');
const WorkPage = require('../components/page/Work');

const matchURI = ({pathname}, dispatch) => {
  const props = {
    key: pathname,
    dispatch
  };

  switch (pathname) {
    case '/':
      return <HomePage {...props} />
    case '/about':
      return <AboutPage {...props} />
    case '/work':
      return <WorkPage {...props} />
    default:
      return null;
  }
};

class PageContainer extends React.Component {
  constructor(props) {
    super(props);

    const initialState = {
      location: props.location
    };
    this.state = initialState;

    const reducer = new PromisedReducer(initialState);
    reducer.on(':update', state => this.setState(state));

    const emitter = new EventEmitter();
    this.dispatch = emitter.emit.bind(emitter);

    const subscribe = emitter.on.bind(emitter);
    subscribe(
      'push-queue',
      queue => reducer.update(state => queue().then(() => state))
    );
    subscribe(
      'update-location',
      location => reducer.update(state => ({location}))
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location) {
      this.dispatch('update-location', nextProps.location);
    }
  }

  render() {
    const matchComponent = matchURI(this.state.location, this.dispatch);

    return (
      <TransitionGroup component="div">
        {matchComponent}
      </TransitionGroup>
    );
  }
}

module.exports = PageContainer;
