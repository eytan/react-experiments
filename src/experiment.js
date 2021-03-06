import React from 'react';
import ExperimentEnrollment from './experimentEnrollment';
import Utils from './utils';

export const Experiment = React.createClass({
  getDefaultProps() {
    return {
      isEnrolled: true
    };
  },

  getInitialState() {
    return {
      exposedVariation: null
    };
  },

  componentDidMount() {
    this.selectVariation();
  },

  selectVariation() {
    let experiment;
    const {param, isEnrolled} = this.props;

    if (!this.props.experimentClass || !this.props.experimentClass.inputs) {
      console.error("You must pass in an experimentClass instance as a prop");
      return;
    }

    if (React.Children.count(this.props.children) === 0) {   
      throw 'You must have at least one variation in an experiment';  
    }

    if (!isEnrolled) {
      this.setState({
        exposedVariation: null
      });
      return;
    }

    experiment = Utils.suppressAutoExposureLogging(this.props.experimentClass);
    this.setState({
      exposedVariation: experiment.get(param)
    });
  },

  renderExposedVariation() {
    let variationComponent = ExperimentEnrollment.getExposedExperimentVariation(this.props.children, this.state.exposedVariation);

    if (variationComponent.exposedVariation) {
      this.props.experimentClass.logExposure();
      return variationComponent.exposedVariation;
    } else if (variationComponent.defaultComponent) {
      return variationComponent.defaultComponent;
    }
    return null;
  },

  render() {
    return this.renderExposedVariation();
  }
});
