var SimManager = {}

/**
 * Tried to put private methods and variables but it didn´t work!!
 */

SimManager.builder = function() {
    return new function() {
        this.simulations = [];

        this.push = function(sim) {
            this.simulations.push(sim);
            return this;
        }

        this.build = function() {
            return new SimManager.SimManager(this.simulations);
        }
    };
}

SimManager.SimManager = function(_simulations){
    /**
    * state of opened simulations, is a number \in {0, ... , n}.
    * Where state 0, represents closed simulations, and state != 0 represents all simulations close unless simulations[state-1].
    **/
    this.stateIndexApplicationOpen = 0;
    this.simulations = _simulations;

    this.closeState = function(state) {
        if(state > 0) {
            this.simulations[state - 1].end();
        }
    }

    this.openState = function(state) {
        this.simulations[state - 1].start();
    }

    // click number > 0
    this.clickOperator = function(clickNumber, state) {
        var condition = state != clickNumber;
        if(condition) {
            this.closeState(state);
            this.openState(clickNumber);
        } else {
            this.closeState(state);
        }
        return condition ? clickNumber : 0;
    }

    this.simulate = function(index) {
        this.simulations[index].draw();
        if (this.simulations[index].checkIfCanDraw()) {
            requestAnimationFrame(() => this.simulate(index));
        }
    }

    this.runSimulation = function(index) {
        this.stateIndexApplicationOpen = this.clickOperator(index + 1, this.stateIndexApplicationOpen);
        requestAnimationFrame(() => this.simulate(index));
    }

    this.apply = function(index, lambda) {
        lambda(this.simulations[index]);
        return this;
    }

    this.init = function() {
        this.simulations.forEach(element => element.init());
        return this;
    }
}

SimManager.simulatorBuilder = function() {
    return new function() {
        var throwUndefined = function() {
            throw "Undefined obligatory function";
        }
        this.simulator = {
            "base": {},
            "init": throwUndefined,
            "checkIfCanDraw": throwUndefined,
            "draw": () => throwUndefined,
            "start": () => throwUndefined,
            "end": () => throwUndefined
        };

        this.addBaseSimulator = function(obj) {
            this.simulator.base = obj;
            return this;
        }

        this.init = function(f) {
            this.simulator.init = () => f(this.simulator.base);
            return this;
        }

        this.checkIfCanDraw = function(f) {
            this.simulator.checkIfCanDraw = () => f(this.simulator.base);
            return this;
        }
        
        this.draw = function(f) {
            this.simulator.draw = () => f(this.simulator.base);
            return this;
        }

        this.start = function(f) {
            this.simulator.start = () => f(this.simulator.base);
            return this;
        }

        this.end = function(f) {
            this.simulator.end = () => f(this.simulator.base);
            return this;
        }

        this.build = function() {
            return this.simulator;
        }
    };
}


module.exports = SimManager; 