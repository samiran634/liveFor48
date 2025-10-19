import { useState, useRef, useEffect } from "react";
import { useGlobalData } from "../../context/GlobalContext.jsx";
import { useNavigate } from "react-router-dom";
import img from "../../assets/image-removebg-preview.png";

export default function Mission() {
  const { userData, setUserData } = useGlobalData();
  const [displayText, setDisplayText] = useState("");
  const fileInputRef = useRef(null);
  const fullText = "CREATE_REPLICA.exe";
  const navigate = useNavigate();

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setUserData((prev) => ({ 
        ...prev, 
        imageFile: file,
        imagePreview: imageURL 
      }));
    }
  };

  const handleCameraCapture = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      fileInputRef.current.click();
    } catch (err) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Data is already stored in global context, just navigate
    navigate("/loading");
  };

  return (
    <div
      className="min-h-screen bg-black text-green-400 p-6"
      style={{ fontFamily: "'Courier New', monospace" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with glitch effect feel */}
        <div className="mb-12 pl-4 text-center">
          <h1 className="text-5xl font-bold mb-2 tracking-tighter">
            {displayText}
            <span className="animate-pulse">_</span>
          </h1>
          <p className="text-green-300 mt-2 text-sm">
            [NEURAL_IDENTITY_REPLICATION_SYSTEM]
          </p>
          <p className="text-gray-600 text-xs mt-2">
            $ scanning neural patterns...
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Side - Form */}
          <div className="space-y-6">
            {/* Image Upload Section */}
            <div className="border border-green-400 bg-black p-6 relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-50"></div>

              <h2 className="text-green-400 font-bold mb-4 text-lg">
                [IDENTITY_SCAN]
              </h2>

              {!userData.imagePreview ? (
                <div className="space-y-4">
                  <div className="text-gray-500 text-sm mb-4">
                    $ upload_biometric_data --format=image
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleCameraCapture}
                      className="px-4 py-2 border border-green-400 bg-black hover:bg-green-400/10 text-green-400 font-mono text-sm transition-all hover:shadow-lg hover:shadow-green-400/30"
                    >
                      CAPTURE
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="px-4 py-2 border border-green-400 bg-black hover:bg-green-400/10 text-green-400 font-mono text-sm transition-all hover:shadow-lg hover:shadow-green-400/30"
                    >
                      UPLOAD
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-gray-500 text-sm">
                    $ biometric_data_received [OK]
                  </div>
                  <div className="border border-green-400/50 p-3 inline-block">
                    <img
                      src={userData.imagePreview}
                      alt="Selected"
                      className="w-32 h-32 object-cover"
                    />
                  </div>
                  <div className="text-gray-500 text-xs mt-2">
                    <button
                      type="button"
                      onClick={() => setUserData(prev => ({ ...prev, imageFile: null, imagePreview: null }))}
                      className="text-green-400 hover:underline"
                    >
                      $ replace_data
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {[
                { name: "name", label: "SUBJECT_NAME", field: "name" },
                {
                  name: "occupation",
                  label: "OCCUPATION_CLASS",
                  field: "occupation",
                },
                {
                  name: "fondestMemory",
                  label: "MEMORY_VAULT_01",
                  field: "fondestMemory",
                  rows: 3,
                },
                {
                  name: "darkestSecret",
                  label: "DARKEST SECRET_LOG",
                  field: "darkestSecret",
                  rows: 3,
                },
              ].map((field) => (
                <div
                  key={field.name}
                  className="border border-green-400/50 bg-black p-4"
                >
                  <div className="text-green-300 text-xs mb-2 font-bold tracking-wider">
                    [{field.label}]
                  </div>
                  <textarea
                    name={field.field}
                    onChange={handleInputChange}
                    rows={field.rows || 1}
                    className="w-full bg-black border border-green-400/30 p-2 text-green-400 font-mono text-sm focus:outline-none focus:border-green-400 focus:bg-green-400/5 resize-none leading-relaxed"
                    style={{ caretColor: "#4ade80" }}
                  />
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="mt-8 space-y-3">
              <button
                onClick={handleSubmit}
                className="w-full py-3 border-2 border-green-400 bg-black text-green-400 font-mono font-bold text-lg hover:bg-green-400 hover:text-black transition-all hover:shadow-lg hover:shadow-green-400/50 tracking-wider"
              >
                INITIALIZE_REPLICA
              </button>
              <div className="text-gray-600 text-xs text-center font-mono">
                $ awaiting_neural_transfer...
              </div>
            </div>
          </div>

          {/* Right Side - Spinning Image */}
          <div className="flex items-center justify-center lg:sticky lg:top-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400/20 blur-3xl"></div>
              <div className="relative">
                <style>
                  {`
                    @keyframes spinY {
                      from {
                        transform: rotateY(0deg);
                      }
                      to {
                        transform: rotateY(360deg);
                      }
                    }
                    .spin-y {
                      animation: spinY 4s linear infinite;
                      transform-style: preserve-3d;
                    }
                  `}
                </style>
                <img
                  src={img}
                  alt="Replica"
                  className="spin-y w-full max-w-md h-auto"
                  style={{
                    filter: "drop-shadow(0 0 30px rgba(74, 222, 128, 0.5))",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 border-t border-green-400/30 pt-4 text-gray-600 text-xs font-mono space-y-1">
          <p>$ last_humans_Society </p>
        </div>
      </div>
    </div>
  );
}
