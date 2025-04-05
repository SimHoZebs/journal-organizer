import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import "../services/profile_service.dart";
import "../screens/home_screen.dart";

class SideNavProfile extends StatefulWidget {
  final String? userId;
  final Function(String) onProfileSelected;
  final String? selectedProfileId;
  final String? token;

  const SideNavProfile({
    required this.userId,
    required this.onProfileSelected,
    required this.selectedProfileId,
    required this.token,
    super.key,
  });

  @override
  State<SideNavProfile> createState() => _SideNavProfileState();
}

class _SideNavProfileState extends State<SideNavProfile> {
  final TextEditingController _searchController = TextEditingController();
  late String? userId;
  late String? token;
  List<Map<String, dynamic>> profiles = [];

  @override
  didChangeDependencies() {
    super.didChangeDependencies();

    if (userId == null || token == null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        showSnackBar(context, "Authentication token or User ID not found.");
      });
    } else {
      searchProfilesFunct("");
    }
  }

  void showSnackBar(BuildContext context, String message) {
    if (mounted) {
      // ScaffoldMessenger.of(context).showSnackBar(
      //   SnackBar(content: Text(message), duration: Duration(seconds: 3)),
      // );

      final overLay = Overlay.of(context);
      final overLayComponent = OverlayEntry(
        builder: (context) {
          return Positioned(
            bottom: 20,
            right: 10,
            left: 10,
            child: Align(
              alignment: Alignment.bottomCenter,
              child: Container(
                decoration: BoxDecoration(
                  color: Color.fromRGBO(0, 0, 0, 0.9),
                  borderRadius: BorderRadius.circular(8),
                ),
                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                child: Text(
                  message,
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    height: 1.5,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
          );
        },
      );

      overLay.insert(overLayComponent);

      Future.delayed(Duration(seconds: 3), () {
        overLayComponent.remove();
      });
    }
  }

  void searchProfilesFunct(String query) async {
    if (token == null || userId == null) {
      showSnackBar(context, "Authentication token or User ID not found.");
      return;
    }

    final response = await ProfileService.searchProfiles(
      query,
      token!,
      userId!,
    );

    if (response["success"]) {
      final profileList = response["data"]["profiles"];
      setState(() {
        profiles = List<Map<String, dynamic>>.from(profileList ?? []);
      });
    } else if (mounted) {
      showSnackBar(context, response["error"] ?? "Failed to search profiles");
    }
  }

  @override
  void initState() {
    super.initState();

    userId = widget.userId;
    token = widget.token;
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      width: 300,
      child: Column(
        children: [
          // Top Navigation part
          Container(
            padding: EdgeInsets.symmetric(vertical: 8, horizontal: 10),
            decoration: BoxDecoration(
              border: Border(
                bottom: BorderSide(color: Colors.white, width: 0.5),
              ),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Close Nav Icon
                IconButton(
                  style: IconButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  icon: SvgPicture.asset(
                    "assets/icons/close-nav-icon.svg",
                    semanticsLabel: "Close Nav Icon",
                    width: 25,
                    height: 25,
                    colorFilter: ColorFilter.mode(
                      Colors.white,
                      BlendMode.srcIn,
                    ),
                    placeholderBuilder:
                        (context) => SizedBox(
                          width: 25,
                          height: 25,
                          child: CircularProgressIndicator(),
                        ),
                  ),
                ),

                Spacer(),

                //Notes Page Button
                IconButton(
                  style: IconButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => HomeScreen()),
                    );
                  },
                  icon: SvgPicture.asset(
                    "assets/icons/notes-page-icon.svg",
                    semanticsLabel: "Notes Page Icon",
                    width: 25,
                    height: 25,
                    colorFilter: ColorFilter.mode(
                      Colors.white,
                      BlendMode.srcIn,
                    ),
                    placeholderBuilder:
                        (context) => SizedBox(
                          width: 25,
                          height: 25,
                          child: CircularProgressIndicator(),
                        ),
                  ),
                ),

                SizedBox(width: 12),

                // People Page Button
                IconButton(
                  style: IconButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  icon: SvgPicture.asset(
                    "assets/icons/people-relationship-icon.svg",
                    semanticsLabel: "People Relationship Icon",
                    width: 25,
                    height: 25,
                    colorFilter: ColorFilter.mode(
                      Colors.white,
                      BlendMode.srcIn,
                    ),
                    placeholderBuilder:
                        (context) => SizedBox(
                          width: 25,
                          height: 25,
                          child: CircularProgressIndicator(),
                        ),
                  ),
                ),
              ],
            ),
          ),

          SizedBox(height: 14),

          // Search Bar
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 20),
            child: TextField(
              controller: _searchController,
              onChanged: (value) {
                searchProfilesFunct(value);
              },
              cursorHeight: 24,
              cursorColor: Colors.white,
              cursorWidth: 1,
              style: TextStyle(fontSize: 16, height: 1.5),
              decoration: InputDecoration(
                constraints: BoxConstraints(maxHeight: 40),
                contentPadding: EdgeInsets.symmetric(
                  vertical: 4,
                  horizontal: 10,
                ),
                hintText: "Search Profiles",
                hintStyle: TextStyle(fontSize: 16, height: 1.5),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide(color: Colors.white, width: 0.5),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide(color: Colors.white, width: 0.5),
                ),
              ),
            ),
          ),

          SizedBox(height: 14),

          // List of Profiles
          Expanded(
            child: ListView.builder(
              padding: EdgeInsets.symmetric(horizontal: 14),
              itemCount: profiles.length,
              itemBuilder: (context, index) {
                return Container(
                  margin: EdgeInsets.only(bottom: 4),

                  //Individual Profile
                  child: TextButton(
                    style: TextButton.styleFrom(
                      padding: EdgeInsets.all(0),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      backgroundColor:
                          widget.selectedProfileId == profiles[index]["_id"]
                              ? Color.fromRGBO(209, 213, 219, 1)
                              : Colors.transparent,
                    ),
                    onPressed: () {
                      setState(() {
                        widget.onProfileSelected(profiles[index]["_id"]);
                        Navigator.pop(context);
                      });
                    },
                    child: Padding(
                      padding: EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      child: Text(
                        "${profiles[index]["profileTitle"]}",
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          height: 1.5,
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          SizedBox(height: 14),

          // User Options Section
          Container(
            padding: EdgeInsets.symmetric(vertical: 10, horizontal: 20),
            decoration: BoxDecoration(
              border: Border(top: BorderSide(color: Colors.white, width: 0.5)),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.white, width: 1),
                    shape: BoxShape.circle,
                  ),
                  child: SvgPicture.asset(
                    "assets/icons/contact-icon.svg",
                    semanticsLabel: "User Contact Icon",
                    width: 30,
                    height: 30,
                    colorFilter: ColorFilter.mode(
                      Colors.white,
                      BlendMode.srcIn,
                    ),
                    placeholderBuilder:
                        (context) => SizedBox(
                          width: 32,
                          height: 32,
                          child: CircularProgressIndicator(),
                        ),
                  ),
                ),
                SizedBox(width: 12),

                Expanded(
                  child: Text(
                    "User Name",
                    style: TextStyle(fontSize: 18, height: 1.75 / 1.125),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),

                SizedBox(width: 12),

                // Logout Button
                IconButton(
                  style: IconButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  icon: SvgPicture.asset(
                    "assets/icons/logout-icon.svg",
                    semanticsLabel: "Logout Icon",
                    width: 25,
                    height: 25,
                    colorFilter: ColorFilter.mode(
                      Colors.white,
                      BlendMode.srcIn,
                    ),
                    placeholderBuilder:
                        (context) => SizedBox(
                          width: 25,
                          height: 25,
                          child: CircularProgressIndicator(),
                        ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
