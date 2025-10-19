"""
Test script to verify backend setup and D-ID API connectivity
Run this before starting the full application
"""
import os
from dotenv import load_dotenv
import requests

load_dotenv()

def test_environment():
    """Test if all required environment variables are set"""
    print("=" * 50)
    print("TESTING ENVIRONMENT VARIABLES")
    print("=" * 50)
    
    required_vars = ["D_ID_API_KEY", "GEMINI_API_KEY", "BASE_URL"]
    all_set = True
    
    for var in required_vars:
        value = os.getenv(var)
        if value:
            # Mask sensitive data
            if "KEY" in var:
                display_value = value[:8] + "..." if len(value) > 8 else "***"
            else:
                display_value = value
            print(f"✓ {var}: {display_value}")
        else:
            print(f"✗ {var}: NOT SET")
            all_set = False
    
    print()
    return all_set

def test_d_id_api():
    """Test D-ID API connectivity"""
    print("=" * 50)
    print("TESTING D-ID API CONNECTIVITY")
    print("=" * 50)
    
    api_key = os.getenv("D_ID_API_KEY")
    if not api_key:
        print("✗ Cannot test - D_ID_API_KEY not set")
        return False
    
    try:
        # Test with a simple API call to get credits
        url = "https://api.d-id.com/credits"
        headers = {
            "accept": "application/json",
            "authorization": f"Bearer {api_key}"
        }
        
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✓ D-ID API Connection: SUCCESS")
            print(f"  Remaining Credits: {data.get('remaining', 'Unknown')}")
            return True
        else:
            print(f"✗ D-ID API Connection: FAILED")
            print(f"  Status Code: {response.status_code}")
            print(f"  Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"✗ D-ID API Connection: ERROR")
        print(f"  Error: {str(e)}")
        return False

def test_uploads_folder():
    """Test if uploads folder exists and is writable"""
    print("=" * 50)
    print("TESTING UPLOADS FOLDER")
    print("=" * 50)
    
    upload_folder = "static/uploads"
    
    if os.path.exists(upload_folder):
        print(f"✓ Folder exists: {upload_folder}")
    else:
        print(f"  Creating folder: {upload_folder}")
        os.makedirs(upload_folder, exist_ok=True)
        print(f"✓ Folder created: {upload_folder}")
    
    # Test write permission
    test_file = os.path.join(upload_folder, "test.txt")
    try:
        with open(test_file, "w") as f:
            f.write("test")
        os.remove(test_file)
        print(f"✓ Folder is writable")
        return True
    except Exception as e:
        print(f"✗ Folder is not writable: {str(e)}")
        return False

def test_base_url():
    """Test if BASE_URL is accessible"""
    print("=" * 50)
    print("TESTING BASE URL")
    print("=" * 50)
    
    base_url = os.getenv("BASE_URL")
    if not base_url:
        print("✗ BASE_URL not set")
        return False
    
    print(f"  BASE_URL: {base_url}")
    
    if "localhost" in base_url or "127.0.0.1" in base_url:
        print("⚠ WARNING: BASE_URL points to localhost")
        print("  D-ID API will NOT be able to access your images")
        print("  Please use ngrok or similar to expose your server")
        print("  Example: ngrok http 5000")
        return False
    else:
        print(f"✓ BASE_URL is publicly accessible")
        return True

if __name__ == "__main__":
    print("\n" + "=" * 50)
    print("BACKEND SETUP TEST")
    print("=" * 50 + "\n")
    
    results = []
    results.append(("Environment Variables", test_environment()))
    results.append(("Uploads Folder", test_uploads_folder()))
    results.append(("Base URL", test_base_url()))
    results.append(("D-ID API", test_d_id_api()))
    
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    
    all_passed = True
    for test_name, passed in results:
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"{status}: {test_name}")
        if not passed:
            all_passed = False
    
    print()
    if all_passed:
        print("🎉 All tests passed! You're ready to start the application.")
    else:
        print("⚠ Some tests failed. Please fix the issues above.")
        print("   See FIXES_AND_SETUP.md for detailed instructions.")
    print()
