import { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { login, saveToken, getToken } from '../api/auth';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await login(username, password);
      if (res.token) {
        await saveToken(res.token);

        const token = await getToken();
        console.log('Token saved in AsyncStorage:', token);

        Alert.alert('Успешно!', `Добро пожаловать, ${res.username}`);
        navigation.navigate('Map');
      } else {
        Alert.alert('Ошибка', res.msg || 'Не удалось войти');
      }
    } catch (err) {
      console.error('Login error:', err);
      Alert.alert('Ошибка', 'Произошла ошибка при входе');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <TextInput 
        placeholder="Имя пользователя" 
        value={username} 
        onChangeText={setUsername} 
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} 
      />
      <TextInput 
        placeholder="Пароль" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} 
      />
      <Button title="Войти" onPress={handleLogin} />
      <Text style={{ marginTop: 10, color: 'blue' }} onPress={() => navigation.navigate('Register')}>
        Зарегистрироваться
      </Text>
    </View>
  );
}
