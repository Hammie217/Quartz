#TechnologyFocus

I've recently been introduced to a connectivity platform called FogLAMP (or Fledge) and to try and get my head around what it's doing, I've spent some time pulling together a dev environment, reading the documentation and getting a small working demo.

### What is Fledge/FogLAMP
After spending a good amount of time confused between the different platforms, Fledge and FogLAMP, I've discovered that they are effectively the same thing, the only difference being Fledge is the open source version owned by The Linux Foundation, whereas FogLAMP is the closed source version from Dianomic but for all intents and purposes they are identical platforms so please excuse me if I use the names interchangeably.

Fledge is a [[Microservices]] architecture platform designed to collect, process and forward on data from shop floor equipment to a higher-level system. The key microservices are:
- South Service - Connect and collect from downstream equipment, also capable of *filtering* data to transform data in realtime
- Storage Service - Short term storage of data to enable certain functionality that requires history as well as network fault tolerance
- Event Service - Allow creation of rules to trigger specific actions 
- Set Point Control Service - Write down data to south service (Aka fan speed)
- North Service - Connect and transmit data from Fledge to a higher level system,  also capable of *filtering* data to transform data in realtime
- Rest API - Allows access to all Fledge microservices for interacting with the system

![[Pasted image 20250305104309.png|600]]

### Configuring Fledge
Fledge is designed to be able to run in any way you like as long as it's Linux, currently it supports a couple Ubuntu versions and a couple Buster versions, it can run directly on bare metal, on a VM, or my personal favourite in a [[Container]]. However I am concerned that neither Fledge nor FogLAMP seem to be pushing for a [[Container]]ised [[Microservices]] architecture where each microservice can be automatically scaled through something like [[Kubernetes]]. As such it seems The Linux Foundation define a limit of 120k Tags or 120k reads per sec which in a large factory could easily be hit, instead it appears Fledge is pushing a distributed architecture with many Fledge instances closer to the equipment, that does improve redundancy and latency for real-time control but in my opinion really removes the benefit of the [[Microservices]] architecture and is a step back in terms of platform management. It seems like team at Dianomic has realised this and is offering a platform *FogLAMP Manage* that allows you to manage all Fledge instances from one place but as far as I can tell does not solve the autoscaling issue.

### Using Fledge
Overall the Fledge UI is very intuitive and modern using what seems to be a Material UI component library allowing for everything to be configured with no-code, assuming Fledge already has the plugin you want. Each type of configuration item in Fledge has its own page with a single side navigation bar to swap between these. As previously mentioned Fledge runs a microservices architecture including the UI which effectively acts as a gateway to talk to Fledge over the REST API.
![[Pasted image 20250324091631.png]]

#### South Services
The South Services section is the equivalent of [[Kepware]] drivers connecting down to equipment, Fledge seems to have a good selection of drivers and allows you to import external drivers, this for me is one of the best parts I've seen about Fledge, the ability to import new drivers and not be stuck by what is available from the vendor, the really great thing is being able to not only import other available drivers but program your own using the Python/C++ supported endpoints. In my testing this allowed me to create a custom driver to talk directly to Mettler Toledo scale heads over MTSICS, something most platforms don't have built in drivers for. 

I also took a look around the Siemens S7 driver to try and pull some data from a [[PLC]], the way Fledge handles this is a bit different to other systems, making use of [[JSON]] to define a map of tags to collect, although this approach is easy for the driver to ingest and for storing configuration in a backup system, generating this map is a menial task and prone to error. When testing this driver it also seems like Fledge doesn't like strings with them not being supported in the S7 driver which is a bit of a showstopper for an site using Siemens PLCs. When also trying out my own driver it again seems like Fledge really struggles to ingest strings but works first time with number values, looking through the Fledge documentation however it appears that strings work fine so I'm not sure if I've a different version or I'm just missing something but either way I can definitely say it's not simple and robust.

When using these south services a bit more and collecting a good amount of data it seems the application speed started to tank with creating drivers taking minutes and viewing driver logs even crashing the backend requiring a restart. It may be possible that with a beefier container this would be fine but the fact these errors are not handled and can easily lead to complete failure of your data flows shows that this platform might not be quite ready for industry yet.
#### Filters
Filters are data pre-processing functions that can be applied to either south or north sources to complete simple or complex transformations such as [[Fast Fourier Transform]] or a generic mathematical expression. Filters can also be used to add metadata for example the ISA95 physical hierarchy allowing for higher level systems to understand the data better, this could even be used to effectively create a [[Unified NameSpace]].

As mentioned, Filters can be applied to either south or north services, however in the south a filter can only be applied to individual tags, this isn't usually an issue but if you had a system with 100 temperatures and wanted to transform them all in Kelvin you would need to create 100 separate filters. On the other hand north filters apply to every datapoint going through that north connector, this allows you to apply a filter to many different things but also means that this filter *must* be applied to everything which I rarely see being usable.

![[Pasted image 20250324140806.png]]

#### Control
Fledge seems to have three different ways of interacting with south systems:
- Internal Notifications
- API endpoints that can be used internally and externally
- Control Pipelines/Dispatcher to interact with south connectors based on north input

##### Notifications
Fledge notifications are a way to send data to a south service automatically based on a notification policy. For example a temperature setpoint could be used to control a fan or cooler, this is a neat little control layer that could be used for simple interactions between systems, Fledge thankfully does realise and mention in their documentation that this should not be used in replacement of [[PLC]] control but if the reliability of this platform improved I could see this being a really neat feature that allows for super simple control without the need for a full [[SCADA]] layer. These notifications also allow integration with external systems such as Email and Slack to get alerts directly, quite neat but something I can't see many big companies allowing through their [[OT]] firewalls.

As part of the notifications process you define the data you'd like to write down, including a capability for writing dynamic values down (based on the read value) with simple logic in [[JSON]]. However what isn't mentioned in the documentation, is how the Fledge scripts, Operations and API endpoints can be controlled through this notification service.

```
{
    "values" : {
         "speed"  : "500"
}
```

![[Pasted image 20250324175336.png]]


##### API Endpoints
Fledge allows the creation of API entry points that can execute south service Writes and Operations defined in their drivers with specific parameters, for example I used this to write down a tare to a scale head based on the driver written. This seems to work well, I really like the fact this is then opened up as an API endpoint for any system to hit, this again would be really useful in an application without a [[SCADA]] platform that needs some basic control via an [[MES]] layer, if these were connected into a [[Unified NameSpace]] platform these could be a great tool for quick integration into many platforms, however with the rise of [[Modular Type Package]] any system with a compliant MTP file would automatically have this functionality over OPC UA with no manual intervention. 
![[Pasted image 20250324183852.png]]
##### Dispatcher
The Fledge Dispatcher seems to be the control method of taking a trigger from a north service and using that to operate the south services, in Fledge it's called the Control Services.
Here Scripts are created that define steps to be completed, I really like how simple this is and allows for many operations to be completed in order for more complex control. I didn't manage to test this functionality but simply by creating this script a north service calling an operation with that name such as over HTTP, OPC UA or MQTT should trigger that script. It's a bit strange that the only way to trigger this dispatcher is through the name, I can imagine this will take a lot of trial and error to get working. It would be great to see a more defined and agile method of north services calling these scripts.

![[Pasted image 20250324182729.png]]

Overall the Fledge control seems capable and even useful for architectures that currently don't have a [[SCADA]] or [[Modular Type Package]] but it seems slightly confused and overcomplex with very similar UI and configuration for many different ways of doing thins, which I'm sure makes sense once you've used it enough. I do really like the no-code by default approach as well as the ability to add in custom code to do things not currently supported out of the box. However, and it's a big however, even if the platform is great, if it's not stable enough to always work, then there's no point in control functionality existing. 
#### North Services
As you'd expect based on the south services, north services allow data collected to be served to higher level systems over protocols such as MQTT or OPC UA. Using the north services it seems like Fledge is designed for [[PubSub]] protocols first, to try and mimic a [[Kepware]] setup, I tried to serve some collected data over the North OPC UA plugin. Just like with the south services a [[JSON]] string is required to define the data to be served. I must admit this approach is a bit of a nightmare, not only to first get working but then every time a change is made to the data collected you also need to update the north connector. 

### Conclusion
Based on the testing I've done I believe Fledge/FogLAMP presents a compelling microservices-based approach to industrial connectivity, offering a flexible way to integrate shop floor data with higher-level systems. Its no-code configuration, open API access, and support for custom plugins make it a powerful tool, particularly in environments without a traditional SCADA system. However, some aspects—such as its reliance on JSON for configuration, lack of robust autoscaling, and stability concerns—suggest that it's not yet a mature solution for large-scale industrial deployments. If the platform can address these reliability and performance challenges, it has the potential to be a serious player in the industrial IoT space.
