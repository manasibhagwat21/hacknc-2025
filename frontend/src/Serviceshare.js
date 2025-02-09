import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Serviceshare.css";

const Serviceshare = () => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flip, setFlip] = useState(false);
  const [matches, setMatches] = useState(null);

  const introLines = [
    "A fun new way to barter services with others!",
    "Looking for help or offering something you can do?",
    "Just select a service you need, and let’s get swapping!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFlip(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % introLines.length);
        setFlip(false);
      }, 500);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const services = [
    "House cleaning", "Grocery shopping", "Pet sitting", "Lawn care", "Dog walking",
    "Babysitting", "Personal shopping", "Errand running", "Tutoring", "Fitness training",
    "Language lessons", "Cooking meals", "Car washing", "Handyman services", "Moving assistance",
    "Organizing closets", "Flower arrangement", "Laundry services", "Interior decorating",
    "Laundry folding", "Gardening", "Massage therapy", "Recycling pick-up", "Carpooling", "Event planning"
  ];

  const user_id = 6; // Replace with actual logged-in user ID

  const handleServiceClick = (service) => {
    setSelectedServices((prevServices) =>
      prevServices.includes(service)
        ? prevServices.filter((s) => s !== service)
        : [...prevServices, service]
    );
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8000/users/update-services-need", {
        user_id,
        services: selectedServices,
      });

      const response = await axios.get(`http://localhost:8000/users/${user_id}/matches`);
      setMatches(response.data);

      console.log("Services updated successfully!");
    } catch (error) {
      console.error("Error updating services:", error);
    }
  };

return (
    <div>
        <nav className="navb">
            <div className="logo">
                <img 
                    src="https://png.pngtree.com/png-clipart/20221029/original/pngtree-shake-hands-png-image_8742463.png" 
                    alt="Handshake" 
                    className="logo-img"
                />
            </div>
        </nav>

        <div className="serviceshare-container">
            <div className="intro-section">
                <div className={`flip-card ${flip ? "flipping" : ""}`}>
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <h2>{introLines[currentIndex]}</h2>
                        </div>
                        <div className="flip-card-back">
                            <h2>{introLines[(currentIndex + 1) % introLines.length]}</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="service-section">
                <h2>I am looking for someone to do:</h2>
                <div className="service-bubbles">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className={`bubble ${selectedServices.includes(service) ? "selected" : ""}`}
                            onClick={() => handleServiceClick(service)}
                        >
                            {service}
                        </div>
                    ))}
                </div>
                <button className="enter" onClick={handleSubmit}>Enter</button>
            </div>

            {matches && (
                <div className="matches-section">
                    <h2>Matches Found</h2>

                    <div className="matches-container">
                        {/* Left Section - People Looking for Your Services */}
                        <div className="match-category">
                            <h3>People Looking for Your Services</h3>
                            {matches.usersLookingForYourServices.length > 0 ? (
                                <ul>
                                    {matches.usersLookingForYourServices.map((user) => (
                                        <li key={user.user_id} className="user-card">
                                            <div className="user-avatar">{user.username[0]}</div>
                                            <div className="user-info">
                                                <strong>{user.username}</strong>
                                                <p>Needs: {user.needs.join(", ")}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No matches found.</p>
                            )}
                            <p className="funky-text">🔥 You're in demand! 🔥</p>
                        </div>

                        {/* Right Section - People Offering What You Need */}
                        <div className="match-category">
                            <h3>People Offering What You Need</h3>
                            {matches.usersOfferingWhatYouNeed.length > 0 ? (
                                <ul>
                                    {matches.usersOfferingWhatYouNeed.map((user) => (
                                        <li key={user.user_id} className="user-card">
                                            <div className="user-avatar">{user.username[0]}</div>
                                            <div className="user-info">
                                                <strong>{user.username}</strong>
                                                <p>Offers: {user.offers.join(", ")}</p>
                                                <div className="req">Request 📩 </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No matches found.</p>
                            )}
                            <p className="funky-text">✨ Perfect matches await! ✨</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
);
};

export default Serviceshare;
