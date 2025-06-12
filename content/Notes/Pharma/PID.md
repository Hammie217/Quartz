Proportional, Integral, Derivative (PID) is a [[Closed Loop]] control methodology which uses three different calculations to determine the output control signal:
- Proportional - The difference between the input value and feedback value
- Integral - The integral of the error between input and feedback value
- Derivative - The rate of change of error between input and feedback value 

These three values are then scaled by their respective constant and summed together to generate the PID output signal.

These PID constants are set per system and require tuning based on your system requirements such as how quickly a system must respond to change or acceptable overshoot. Methodologies exist to support in this PID tuning such as [[Ziegler-Nichols]].