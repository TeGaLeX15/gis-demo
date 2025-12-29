import { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { register, saveToken, getToken } from '../api/auth';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const res = await register(username, password);
      if (res.token) {
        await saveToken(res.token);

        const token = await getToken();
        console.log('Token saved in AsyncStorage:', token);

        Alert.alert('Успешно!', 'Регистрация завершена');
        navigation.navigate('Map');
      } else {
        Alert.alert('Ошибка', res.msg || 'Не удалось зарегистрироваться');
      }
    } catch (err) {
      console.error('Register error:', err);
      Alert.alert('Ошибка', 'Произошла ошибка при регистрации');
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
      <Button title="Зарегистрироваться" onPress={handleRegister} />
      <Text style={{ marginTop: 10, color: 'blue' }} onPress={() => navigation.navigate('Login')}>
        Уже есть аккаунт? Войти
      </Text>
    </View>
  );
}
