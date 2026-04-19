import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { TextInput } from 'react-native-web';
import { useState, useEffect, useRef } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 

const Stack = createNativeStackNavigator();

 function QuizScreen({navigation}) {
  const questions = [  {
    "prompt": "What color does not appear on any official nations' flag?",
  "type": "multiple-choice",
  "answers": [
    "purple",
    "green",
    "yellow",
    "black",
  ],
  "correct": "purple"
},
  {
    "prompt": "What colors are on the Canadian flag?",
  "type": "multiple-answer",
  "answers": [
    "red",
    "blue",
    "purple",
    "white",
  ],
  "correct": ["red","white"]
},
  {
  "prompt": "All counrties use the standard rectangle flag.",
  "type": "true-false",
  "answers": [
    "True",
    "False",
  ],
  "correct": "False"
},
]
const isFirstRender = useRef(true);
let [currentQuestion, setCurrentQuestion]= useState(0)
let [chosenAnswer, setChosenAnswer]= useState('')
const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  }) 
const { prompt, answers, correct } = questions[currentQuestion]
const [nextButton, setNextButton] = useState(0)
const [answerPicked, setAnswerPicked]= useState(0)
 useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setCurrentQuestion(currentQuestion + 1)
    setChosenAnswer('')
  }, [nextButton])

const onAnswerSelected = (answer, index) => {
    if (Array.isArray(correct)) {
      setChosenAnswer(correct.includes(answer))
    } else {
      setChosenAnswer(answer === correct)
    }
  }

  return (
    <View style={styles.container}>
      <Text>Question {nextButton+1}</Text>
      <Text> {questions[currentQuestion].prompt}</Text>
      <ul>
        {answers.map((answer, index) => (
          <li onClick={() => {
    onAnswerSelected(answer, index)
    setAnswerPicked(answerPicked + 1)
  }} key={answer}>{answer}</li>
        ))}
      </ul>
      { answerPicked > 0 ? (
    nextButton < 2 ? (
      <Button onPress={() => {
    console.log('chosenAnswer:', chosenAnswer)
    console.log('correct:', correct)
    setResult((prev) =>
      chosenAnswer
        ? { ...prev, score: prev.score + 1, correctAnswers: prev.correctAnswers + 1 }
        : { ...prev, wrongAnswers: prev.wrongAnswers + 1 }
    )
    setNextButton(nextButton + 1)
  }} title="Next" />
    ) : (
      <Button onPress={() => {
      navigation.navigate("Results", { result: chosenAnswer
    ? { ...result, score: result.score + 1, correctAnswers: result.correctAnswers + 1 }
    : { ...result, wrongAnswers: result.wrongAnswers + 1 }
  })}} title="Results" />
    )
  ) : null }
      <StatusBar style="auto" />
    </View>
  );
}

function ResultsScreen({route}) {
  const { result } = route.params
return(
  <View style={styles.container}>
    <Text>Total Score</Text>
  <Text>{result.score}/3</Text>
  </View>
)
}

export default function App() {
  return (
     <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
    </Stack.Navigator>
    </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input:{
    margin: 20,
    borderWidth: 2,
    backgroundColor: '#ffffff'
  }
});
