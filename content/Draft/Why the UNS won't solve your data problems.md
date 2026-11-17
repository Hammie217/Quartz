Although the move towards the Unified namespace is a great move for the majority of manufacturing companies, it isn't the sexy silver bullet that it's perceived to be through the sky high thinking slides shown by every consultant in the business. I'm just as fallible as the next engineer for the distraction of new technology on the block promising to revolutionise the world but the UNS doesn't resolve the duck tape holding data pipelines together, it highlights how unstandardised your shop floor really is. The reality is your digital foundations matter much more than if you have a perfect [[High Availability]] cluster of [[MQTT]] brokers.

Your data pipeline from sensor to cloud is only as strong as the weakest link in the chain, no matter how much you invest in a perfect data pipeline in the tech space, your PLCs that aren't networked still aren't going to be networked, it's an unfortunate truth I've seen far too often that many industrial data pipelines are still held together with thick ethernet converters hanging in control cabinets. An unfortunate downside of the resilience of automation systems lasting the test of time vs the typical technology refresh of modern day software.

Along a similar train of thought, even recently modern automation systems can't integrate directly to the UNS, and although there are suppliers and systems starting to support this direct connection, even if your cyber security allows this (Which in most cases they shouldn't), 99% of your assets in your manufacturing environment will not be capable of connection. As such you now need new OT integration software in the ever growing technology chain, from there you now need to manage all of these system specific connections, many of these connections become rather complex once you start talking beyond real time data integration and want to extract batch contextualised data such as alarms, events, audit trail and batch data, each of which are typically deployed in entirely different methods between equipment. 

It's worth noting, that despite the point of a UNS being interoperability between your systems, in its current form proposed by the majority of architects the UNS is not a historian. This means that the point of entry for data professionals trying to understand your process is almost always going to be through your historian. Even if your UNS is perfect, your data consumers are still at the behest of the state of your historian.

Your digital foundations are still rocky

Your systems not networked, still aren't networked. 
Most OT systems can't talk to the UNS directly. Need new OT integration software. Now need to develop and maintain system specific connections
Data formats aren't standardised by default in the UNS. You still need to translate your disparate sources. 
UNS doesn't enforce equipment models. Without data governance your data will still be just as messy but in a new protocol.
A badly designed MES, equipment handshake or data extraction is still bad. No technology fixes this.
The UNS isn't a historian. Your unorgansied historian is still the entry point for data professionals trying to understand the process.


Despite all of these, I still believe the move towards a unified and composable architecture is a great move for many manufacturing companies. However it's even more important to focus on solid foundations in your technical and procedural management.