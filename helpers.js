const fs = require('fs');

exports.moment = require('moment');

exports.dump = obj => JSON.stringify(obj, null, 2);

exports.addCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

exports.icon = name => fs.readFileSync(`./public/icons/${name}.svg`);

exports.weatherIcons = {
  Overcast: 'wi-cloudy',
  'Partly Cloudy': 'wi-day-cloudy',
  'Scattered Clouds': 'wi-cloud',
  'Mostly Cloudy': 'wi-cloudy',
  Rain: 'wi-showers',
  'Light Rain': 'wi-sprinkle',
  'Heavy Rain': 'wi-rain',
  Snow: 'wi-snow',
  'Ice Pellets': 'wi-hail',
  Fog: 'wi-fog',
  Clear: 'wi-day-sunny'
};

exports.createSummary = (responses) => {
  let summary = '';

  function arrayToSentance(arr) {
    if (arr.length > 2) {
      return `${arr.slice(0, arr.length - 1).join(', ')} and ${arr.slice(-1)}`;
    } else if (arr.length === 2) {
      return `${arr[0]} and ${arr[1]}`;
    }
    return arr;
  }

  function numToWord(num) {
    const numbers = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine '];

    if (num < 10) {
      return numbers[num];
    }
    return num;
  }

  responses.forEach((response) => {
    if (response.questionPrompt === 'How did you sleep?') {
      summary += `I slept ${response.answeredOptions[0].toLowerCase()}. `;
    }
    if (response.questionPrompt === 'Do you remember your dreams?') {
      if (response.answeredOptions[0] === 'No') {
        summary += 'I couldn’t remembered my dreams. ';
      } else {
        summary += 'I remembered my dreams. ';
      }
    }
    if (response.questionPrompt === 'Did you snooze?') {
      if (response.answeredOptions[0] === 'No') {
        summary += 'I got up right away. ';
      } else {
        summary += 'I snoozed. ';
      }
    }
    if (response.questionPrompt === 'What are you doing?') {
      if (response.tokens) {
        const activities = response.tokens;
        if (activities.length > 0) {
          const activitiesArray = [];
          activities.forEach((activity) => {
            activitiesArray.push(activity.text.toLowerCase());
          });
          if (activitiesArray.length === 0) {
            summary += 'I was doing nothing... ';
          } else {
            summary += `I was ${arrayToSentance(activitiesArray)}. `;
          }
        }
      }
    }
    if (response.questionPrompt === 'Who are you with?') {
      if (response.tokens) {
        const people = response.tokens;
        if (people.length > 0) {
          const peopleArray = [];
          people.forEach((person) => {
            peopleArray.push(person.text);
          });
          if (peopleArray[0] === 'No One') {
            summary += 'I was alone. ';
          } else {
            summary += `I was with ${arrayToSentance(peopleArray)}. `;
          }
        }
      }
    }
    if (response.questionPrompt === 'Where are you?') {
      if (response.locationResponse) {
        if (response.locationResponse.text === 'Home') {
          summary += 'I was at home. ';
        } else {
          summary += `I was at ${response.locationResponse.text}. `;
        }
      }
    }
    if (response.questionPrompt === 'How many coffees did you have today?') {
      if (response.numericResponse === '0') {
        summary += 'I didn’t drink coffee today. ';
      } else {
        const coffees = response.numericResponse > 1 ? 'coffees' : 'coffee';
        summary += `I had ${numToWord(response.numericResponse)} ${coffees} today. `;
      }
    }
    if (response.questionPrompt === 'Did you exercise?') {
      if (response.answeredOptions[0] === 'Yes') {
        summary += 'I exercised! ';
      } else if (response.answeredOptions[0] === 'No') {
        summary += 'I didn’t exercise. ';
      }
    }
    if (response.questionPrompt === 'How are you feeling?') {
      if (response.tokens) {
        const feelings = response.tokens;
        if (feelings.length > 0) {
          const feelingsArray = [];
          feelings.forEach((feeling) => {
            feelingsArray.push(feeling.text.toLowerCase());
          });
          summary += `I was feeling ${arrayToSentance(feelingsArray)}. `;
        }
      }
    }
    if (response.questionPrompt === 'Are you working?') {
      if (response.answeredOptions[0] === 'Yes') {
        summary += 'I was working. ';
      } else if (response.answeredOptions[0] === 'No') {
        summary += 'I wasn’t working. ';
      }
    }
  });
  return summary;
};
