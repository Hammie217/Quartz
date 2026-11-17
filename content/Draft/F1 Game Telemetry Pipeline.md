###  Introduction
For those of you that know me well, you'll know that I love building things in my spare time and you may also know that I've recently become a big fan of F1. One of the great things about F1 for me is the amount of engineering and skill that goes into the sport and the backbone of advancing this is data, every team puts huge amounts of effort into collecting, analysing and simulating the data just trying to shave milliseconds off a lap time.

In recent times the advancement of technology has also advanced with playing racing games at home, no longer a 2D map with 8 bit graphics and audio, now with home simulator rigs, VR headsets and the massive improvement in graphics anyone at home can pretend to be their favourite drivers (Bottas/Albon). Whilst playing around with this technology I noticed that many racing games have the ability to stream telemetry data out just like a real car over UDP packets from the game, instantly I was hooked on the idea of having my own racing analytics to really find where I'm losing time and push myself to be better with data.

Just like that, the idea to build a data and analytics pipeline using all the up and coming industry tools began. This project really has been a great example touching on so many different key technologies that are playing a huge role in Industry 4.0 currently and only going to become more important over time for example: [[MQTT]], [[Unified NameSpace]], Node-Red, [[Container]]s, Portainer, Grafana, PostgreSQL, Streamlit, MCP, LLMs. From this project I really hope you get to see how these tools can come together, especially how this could be used in manufacturing and Industry 4.0, and of course if you wanted to use this for your own racing improvements feel free.

### Overall System Architecture
Just before we jump into what this system architecture actually looks like, I'd like to re-iterate the fact that a lot of the reason I've done this project is to show off the industrial tools that are up and coming meaning that this is definitely overkill with a very scalable solution that with a few tweaks is likely robust enough for real productive environments. From an engineering perspective, the same outcome could be achieved in a much simpler way without the need for MQTT or node-red for contextualisation creating a local application. 


So, what does this system architecture actually look like. The architecture starts with the F1 24 game, from here the game fires out a bunch of [[UDP]] packets for a range of different measurements such as the motion of each car on track or lap information to a specified IP and port. To read this data, I have a UDP to MQTT script which parses and publishes the data into a HiveMQ [[MQTT]] broker with all of the different measurements in a hierarchy effectively acting as a home [[Unified NameSpace]]. From there the data is subscribed to by a [[Grafana]] connector for creating a realtime dashboard as well as by a [[Node-RED]] flow, this flow collects the realtime data connecting and contextualising into key datapoints that are stored in a [[PostgreSQL]] database. This database stores all of the key racing data allowing for visualisation in [[Grafana]] as well as a custom [[Streamlit]] website, with the use of a [[MCP]] server this data can also be interrogated by an AI agent such as Claude for on the fly queries and analysis. For each of these components (Excluding the F1 game and Claude), I've deployed these in individual containers all hosted on my home raspberryPi managed through [[Portainer]] making the deployment and management easy. 
![[F124Architecture.png]]

### Component Deep Dive
#### F1 24 to MQTT
#### MQTT Broker
#### Grafana
#### Node-Red
#### PostgreSQL
#### Streamlit Frontend

### Conclusion
Contribute to the project
This architecture works fine for my home but would be a great example of how kubernetes can be used if this was to scale up
Created a UNS that can be used for any other data streaming in the future

