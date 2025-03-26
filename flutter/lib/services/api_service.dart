import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://134.209.175.201:3000/auth';

  static Future<Map<String, dynamic>> login(
      String emailOrUsername, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        "email": emailOrUsername, // Can be email or username
        "username": emailOrUsername,
        "password": password,
      }),
    );

    if (response.statusCode == 200) {
      return {"success": true, "data": jsonDecode(response.body)};
    } else {
      return {
        "success": false,
        "error": jsonDecode(response.body)['error'] ?? "Login failed"
      };
    }
  }

  static Future<Map<String, dynamic>> signup(
      String username, String email, String password) async {
    final url = Uri.parse('$baseUrl/register');

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'email': email,
        'password': password,
      }),
    );

    if (response.statusCode == 201) {
      final data = jsonDecode(response.body);
      return {
        'success': true,
        'token': data['verificationToken'],
        'message': data['message'],
      };
    } else {
      return {
        'success': false,
        'error': jsonDecode(response.body)['error'] ?? 'Unknown error',
      };
    }
  }

  static Future<Map<String, dynamic>> verifyEmail(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/verify-email?token=$token'),
    );

    if (response.statusCode == 200) {
      return {
        'success': true,
        'message': jsonDecode(response.body)['message'],
      };
    } else {
      return {
        'success': false,
        'error': jsonDecode(response.body)['error'] ?? 'Verification failed',
      };
    }
  }
}
