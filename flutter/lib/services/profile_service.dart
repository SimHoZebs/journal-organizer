import 'dart:convert';
import 'package:http/http.dart' as http;
import 'api_base.dart';

/// Service responsible for profile-related API calls
class ProfileService {
  /// Create a new profile
  static Future<Map<String, dynamic>> createProfile(
    Map<String, dynamic> profileData,
    String token,
  ) async {
    final url = Uri.parse('${ApiBase.baseUrl}/profile/create-profile');
    final response = await http.post(
      url,
      headers: ApiBase.getHeaders(token),
      body: jsonEncode(profileData),
    );

    return ApiBase.handleResponse(
      response,
      errorMessage: 'Failed to create profile',
    );
  }

  /// Update an existing profile
  static Future<Map<String, dynamic>> updateProfile(
    String profileId,
    Map<String, dynamic> profileData,
    String token,
  ) async {
    final url = Uri.parse(
      '${ApiBase.baseUrl}/profile/update-profile/$profileId',
    );
    final response = await http.put(
      url,
      headers: ApiBase.getHeaders(token),
      body: jsonEncode(profileData),
    );

    return ApiBase.handleResponse(
      response,
      errorMessage: 'Failed to update profile',
    );
  }

  /// Delete a profile
  static Future<Map<String, dynamic>> deleteProfile(
    String profileId,
    String token,
  ) async {
    final url = Uri.parse(
      '${ApiBase.baseUrl}/profile/delete-profile/$profileId',
    );
    final response = await http.delete(url, headers: ApiBase.getHeaders(token));

    return ApiBase.handleResponse(
      response,
      errorMessage: 'Failed to delete profile',
    );
  }

  /// Get a profile by ID
  static Future<Map<String, dynamic>> readProfile(
    String profileId,
    String token,
  ) async {
    final url = Uri.parse('${ApiBase.baseUrl}/profile/read-profile/$profileId');
    final response = await http.get(url, headers: ApiBase.getHeaders(token));

    return ApiBase.handleResponse(
      response,
      errorMessage: 'Failed to read profile',
    );
  }

  /// Search profiles
  static Future<Map<String, dynamic>> searchProfiles(
    String query,
    String token,
    String userId,
  ) async {
    final url = Uri.parse(
      '${ApiBase.baseUrl}/profile/search?userId=$userId&query=${Uri.encodeComponent(query)}',
    );
    final response = await http.get(url, headers: ApiBase.getHeaders(token));

    return ApiBase.handleResponse(response, errorMessage: 'Search failed');
  }

  /// Get all profiles for a user
  static Future<Map<String, dynamic>> getAllProfiles(
    String userId,
    String token,
  ) async {
    final url = Uri.parse('${ApiBase.baseUrl}/profile/all/$userId');
    final response = await http.get(url, headers: ApiBase.getHeaders(token));

    return ApiBase.handleResponse(
      response,
      errorMessage: 'Failed to get profiles',
    );
  }

  /// Get a specific profile by user ID and profile ID
  static Future<Map<String, dynamic>> getProfileById(
    String userId,
    String profileId,
    String token,
  ) async {
    final url = Uri.parse('${ApiBase.baseUrl}/profile/$userId/$profileId');
    final response = await http.get(url, headers: ApiBase.getHeaders(token));

    return ApiBase.handleResponse(response, errorMessage: 'Profile not found');
  }
}
