#F1 
Having recently stumbled across the [Open F1 API](https://openf1.org/]) I've been intrigued as to what could be done with the data, given my background in data analytics I was keen to take a look into what's available and could be done with it.

On top of this, I recently applied and interviewed for a role at Aston Martin F1 where there was a programming interview that piqued my interest (Annoyingly I didn't practice my python skills before hand and spent the whole interview trying to remember syntax rather than focus on the problem). The interview question was around tyre strategy and trying to figure out when would be the best time to swap tyres given a starting pace and linear degredation of each tyre type. Although I got the Pseudocode working trying to get arrays/dictionarys/lists working together without the internet proved to be too much for the 20 minute timer. 

So, like any sane person, I slept on it and continued to obsess leading me to do this in my spare time. 

The first question I wanted to answer was, for a one stop race, how can I visualise the options and strategic impact of each of these, turns out the answer is fairly simple. For any race we have a loop of laps where we constantly are adding time every lap based on our tyre performance as below:
``` Python
def findLapTime(tyreNum, tyreNum2,lapLength,tyreChange):
	raceTime = 0
	tyreAge = 0;
	try:
		for lapNum in range(0, lapLength):
		  if(lapNum==tyreChange):
			raceTime = raceTime + pitStopDuration + TyreLaptimes[tyreNum2][0]
			tyreAge = 0
		  elif(lapNum>tyreChange):
			raceTime = raceTime  + TyreLaptimes[tyreNum2][tyreAge]
		  else:
			raceTime = raceTime  + TyreLaptimes[tyreNum][tyreAge]
		  tyreAge = tyreAge + 1
	  except:
	    return np.nan
	  return raceTime
```
Beyond that, we have a choice, at what lap do we pit, in this case we are brute forcing and will just try them all to see how long each race takes, and also the choice of tyres, inital tyres and final tyres:
```Python
lapLength = 25
pitStopDuration = 21
tyreTimes = np.zeros((len(TyreLaptimes),len(TyreLaptimes),lapLength))

for tyreNum in range(0, len(TyreLaptimes)):
  for tyreNum2 in range(0, len(TyreLaptimes)):
    for lapNum in range(0, lapLength):
      tyreTimes[tyreNum][tyreNum2][lapNum] = findLapTime(tyreNum,tyreNum2,lapLength,lapNum)

```
And that's it, we have an array of our tyre options and pit time options. Of course this is limited by the data you have access to (We'll discuss later but I only used 16 lap data for each tyre ), a quick plot and we get this:!![[newplot (1).png]]
I've hidden the plots where the same tyres are used but you could easily add checking into the algorithm so that isn't an option. In this case we can see the best strategy is to use tyres 0 and 2 (Soft and hard) and pit at either lap 9 or 16 depending on if you're on softs or hards first.

Beyond this I then ask the question, what about a two stop race, we will then effectively have a 3d surface of each tyre option of when to pit. A little modification to our code to add two pits and another set of tyres to use we get:
```Python
def findLapTime2Pit(tyreNum, tyreNum2,tyreNum3,lapLength,tyreChange,tyreChange2):
  if(tyreChange2<=tyreChange):
    return np.nan

  raceTime = 0
  tyreAge = 0;
  try:
    for lapNum in range(0, lapLength):
      if(lapNum==tyreChange):
        raceTime = raceTime + pitStopDuration + TyreLaptimes[tyreNum2][0]
        tyreAge = 0
      elif(lapNum==tyreChange2):
        raceTime = raceTime  + pitStopDuration + TyreLaptimes[tyreNum3][0]
        tyreAge = 0
      elif(lapNum>tyreChange2):
        raceTime = raceTime  + TyreLaptimes[tyreNum3][tyreAge]
      elif(lapNum>tyreChange):
        raceTime = raceTime  + TyreLaptimes[tyreNum2][tyreAge]
      else:
        raceTime = raceTime  + TyreLaptimes[tyreNum][tyreAge]
      tyreAge = tyreAge + 1
  except:
    return np.nan
  return raceTime

for tyreNum in range(0, len(TyreLaptimes)):
  for tyreNum2 in range(0, len(TyreLaptimes)):
    for tyreNum3 in range(0, len(TyreLaptimes)):
      for lapNum in range(0, lapLength):
        for lapNum2 in range(0, lapLength):
          tyreTimes2Stop[tyreNum][tyreNum2][tyreNum3][lapNum][lapNum2] = findLapTime2Pit(tyreNum,tyreNum2,tyreNum3,lapLength,lapNum,lapNum2)
```
And again after a quick plot in Plotly we get 3D charts of all laps, it's incredibly difficult to see with each overlayed so here's an example of one 3 tyre strategy (Hard-Soft-Inters):![[newplot (3).png]]
I appreciate it's still quite hard to see what's going on here but in the 3D interactive window provided by plotly it's much easier to understand (Speaking of which feel free to view my live code here: [Colab](https://colab.research.google.com/drive/1_qByHZkwIwMM5P5o1a8VWQp65oUwqWNR?usp=sharing)). If you think of it in terms of the previous 2D sketch we have a bunch of arches as you can see at the bottom left, all stacked up into a 3D surface. In this instance the best strategy is the bottom right datapoint with a pit at 16 and 24.

When originally writing this code I created some fake datapoints just like in the interview going from fast lap times to slower lap times. In reality this isn't the case, some tyres need a lap or two to get nice and hot for grip and then degrade over time at differing non-linear rates. My plan was to use the F1 API data to gather these tyre details and calculate their degradation over time, see below a chart of medium tyre lap times for Silverstone this year. ![[newplot (5).png]]
Although this has allowed me to gather some real data that the above graphs are based on I ran into a few issues that can definitely be fixed with enough time but not a job for today such as:
- Doesn't take into consideration track status ( yellow flag,etc...)
- Doesn't take into consideration analogue track variables (Rain, dryness, temp, rubber on track)
- A lot of cars in the race are bumper to bumper, not limited by tyres but by the car in front, in this case lots of people are giving the same stint times.
- One race is not a lot of data, on issue can throw all the readings out
- Struggle to compare tyre data between races as the tracks all have different times, realistically need to do this in some ratio rather than time to allow more data and better comparisons.
- Many many more

If you're interested here's my code (This was a draft so I know full well it's not well done and definitely a lot of stuff that can even be taken out)

```Python 
def get_laps_data(session_key, driver_number):
  try:
    url = f"https://api.openf1.org/v1/laps?session_key={session_key}"
    response = requests.get(url)
    response.raise_for_status()  # Raise an exception for bad status codes
    data = response.json()
    if isinstance(data, list):
      return data
    elif isinstance(data, dict) and "MRData" in data and "RaceTable" in data["MRData"] and "Races" in data["MRData"]["RaceTable"]:
      return data["MRData"]["RaceTable"]["Races"][0]["Laps"]
    else:
      print("Unexpected JSON format")
      return None
  except requests.exceptions.RequestException as e:
    print(f"An error occurred: {e}")
    return None
  except (KeyError, IndexError, TypeError):
    print("Error processing JSON response")
    return None


def get_stints_data(session_key, driver_number):
  try:
    url = f"https://api.openf1.org/v1/stints?session_key={session_key}"
    response = requests.get(url)
    response.raise_for_status()  # Raise an exception for bad status codes
    data = response.json()
    if isinstance(data, list) and data: #check if data is a list and not empty
      return data
    else:
      print("Unexpected JSON format or empty data")
      return None
  except requests.exceptions.RequestException as e:
    print(f"An error occurred: {e}")
    return None
  except (KeyError, IndexError, TypeError):
    print("Error processing JSON response")
    return None

session_key = 9558
driver_number = 77
laps_data = get_laps_data(session_key, driver_number)
stints_data = get_stints_data(session_key, driver_number)

tyre_performance = {}
if stints_data and laps_data:
    for stint in stints_data:
        compound = stint['compound'] tyre_performance[compound,stint['session_key'],stint['driver_number'],stint['stint_number']] = []
        for lap in range(stint['lap_start'] - 1, stint['lap_end']):
            try:
                time = laps_data[lap]['lap_duration']
                if time is not None:  tyre_performance[compound,stint['session_key'],stint['driver_number'],stint['stint_number']].append(time)
            except IndexError:
                print(f"Lap data not found for lap {lap + 1}")
    print (tyre_performance)
else:
    print("Could not retrieve tyre performance data.")
dx = {k: v for k, v in tyre_performance.items() if "MEDIUM" in k[0]}

average_lap_times = {}
for key, lap_times in dx.items():
    for i in range(len(lap_times)):
        lap_number = i + 1  # Lap numbers start from 1
        if lap_number not in average_lap_times:
            average_lap_times[lap_number] = []
        average_lap_times[lap_number].append(lap_times[i])


for lap_number, lap_times in average_lap_times.items():
    average_time = sum(lap_times) / len(lap_times) if lap_times else 0  # Handle empty lists
    print(average_time,",")
```