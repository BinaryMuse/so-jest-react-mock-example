/** @jsx React.DOM */

var React = require("react/addons");
var TriggerAnAction = require("./action");

// Very fake MyStore just so the example runs.
var MyStore = {
  addChangeListener: function() {},
  removeChangeListener: function() {}
};

var SetIntervalMixin = {
  componentWillMount: function() {
    this.interval = null;
  },
  setInterval: function() {
    this.interval = setInterval.apply(null, arguments);
  },
  clearInterval: function(id) {
    clearInterval(this.interval);
    this.interval = null;
  },
  componentWillUnmount: function() {
    this.clearInterval();
  }
};

var Indicator = React.createClass({

  mixins: [SetIntervalMixin],

  getInitialState: function(){
    return{
      elapsed: this.props.rate
    };
  },

  getDefaultProps: function() {
    return {
      rate: 30
    };
  },

  propTypes: {
    rate: React.PropTypes.number.isRequired
  },

  componentDidMount: function() {
    MyStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    MyStore.removeChangeListener(this._onChange);
  },

  refresh: function(){
    this.setState({elapsed: this.state.elapsed-1})

    if(this.state.elapsed == 0){
      this.clearInterval();
      TriggerAnAction();
    }
  },

  render: function() {
    return (
      <p>{this.state.elapsed}s</p>
    );
  },

  /**
   * Event handler for 'change' events coming from MyStore
   */
  _onChange: function() {
    this.setState({elapsed: this.props.rate});
    this.setInterval(this.refresh, 1000);
  }

});

module.exports = Indicator;
