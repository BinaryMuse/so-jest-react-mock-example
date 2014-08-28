/** @jsx React.DOM */

jest.dontMock('../indicator');

var React, IndicatorComponent, Indicator, TestUtils;

describe('Indicator', function() {
  beforeEach(function() {
    React = require('react/addons');
    TestUtils = React.addons.TestUtils;
    // Notice this is the Indicator *class*...
    IndicatorComponent = require('../indicator.js');
    // ...and this is an Indicator *instance* (rendered into the DOM).
    Indicator = TestUtils.renderIntoDocument(<IndicatorComponent />);
    // Jest will mock the functions on this module automatically for us.
    TriggerAnAction = require('../action');
  });

  it('waits 1 second foreach tick', function() {
    // Replace the `refresh` method on our component instance
    // with a mock that we can use to make sure it was called.
    // The mock function will not actually do anything by default.
    Indicator.refresh = jest.genMockFunction();

    // Manually call the real `_onChange`, which is supposed to set some
    // state and start the interval for `refresh` on a 1000ms interval.
    Indicator._onChange();
    expect(Indicator.state.elapsed).toBe(30);
    expect(setInterval.mock.calls.length).toBe(1);
    expect(setInterval.mock.calls[0][1]).toBe(1000);

    // Now we make sure `refresh` hasn't been called yet.
    expect(Indicator.refresh).not.toBeCalled();
    // However, we do expect it to be called on the next interval tick.
    jest.runOnlyPendingTimers();
    expect(Indicator.refresh).toBeCalled();
  });

  it('decrements elapsed by one each time refresh is called', function() {
    // We've already determined that `refresh` gets called correctly; now
    // let's make sure it does the right thing.
    Indicator._onChange();
    expect(Indicator.state.elapsed).toBe(30);
    Indicator.refresh();
    expect(Indicator.state.elapsed).toBe(29);
    Indicator.refresh();
    expect(Indicator.state.elapsed).toBe(28);
  });

  it('calls TriggerAnAction when elapsed reaches zero', function() {
    Indicator.setState({elapsed: 1});
    Indicator.refresh();
    // We can use `toBeCalled` here because Jest automatically mocks any
    // modules you don't call `dontMock` on.
    expect(TriggerAnAction).toBeCalled();
  });
});
