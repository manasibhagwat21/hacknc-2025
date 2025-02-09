import React, { useState } from "react";
import "./Preferences.css";
import { useNavigate } from "react-router-dom";

const questions = [
  { 
    text: "Are you more of a social butterfly or a lone wolf?", 
    left: "Lone Wolf", 
    right: "Social Butterfly",
    leftImage: "https://introvertdear.com/wp-content/uploads/2020/02/introvert-stay-single.jpg",
    rightImage: "https://www.honeylake.clinic/wp-content/uploads/2024/08/Can-You-Be-an-Extrovert-with-Social-Anxiety-1024x683.jpeg"
  },
  { 
    text: "Do you thrive in bustling city life or prefer the calm of nature?", 
    left: "Nature Lover", 
    right: "Urban Explorer",
    leftImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0CxYT3mZd98n_AO_n1LGrE6f0PzmXC_cS0w&s",
    rightImage: "https://images.unsplash.com/photo-1518242007602-8d2524b53ddd?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2l0eSUyMGxpZmV8ZW58MHx8MHx8fDA%3D"
  },
  { 
    text: "Would you rather break a sweat or chill with a book?", 
    left: "Relaxed & Thoughtful", 
    right: "Active & Adventurous",
    leftImage: "https://us.images.westend61.de/0001954919pw/thoughtful-senior-woman-sitting-relaxed-under-blanket-on-sofa-drinking-tea-at-home-ALKF01059.jpg",
    rightImage: "https://www.crystal-travel.com/wp-content/uploads/2024/09/file-15-1024x576.jpg"
  },
  { 
    text: "Do you prefer deep discussions or casual small talk?", 
    left: "Lighthearted Chats", 
    right: "Intellectual Debates",
    leftImage: "https://www.shutterstock.com/image-photo/two-experienced-individuals-deep-conversation-600nw-2351456497.jpg",
    rightImage: "https://www.thirdfactor.org/wp-content/uploads/2022/10/shutterstock_670358728-scaled-e1665533583325.jpg"
  },
  { 
    text: "Are you a night owl or an early bird?", 
    left: "Early Bird", 
    right: "Night Owl",
    leftImage: "https://i.insider.com/6329df5eedbe7f00190f073f?width=700",
    rightImage: "https://www.keckmedicine.org/wp-content/uploads/2021/11/woman-stays-up-late-at-night-in-front-of-laptop-with-glass-of-wine.jpg"
  },
  { 
    text: "Do you enjoy structured plans or spontaneous adventures?", 
    left: "Spontaneous & Free-Spirited", 
    right: "Planner & Organizer",
    leftImage: "https://lonerwolf.com/wp-content/uploads/2019/03/free-spirit-symptoms-signs-test-min-810x587.jpg",
    rightImage: "https://www.brides.com/thmb/lcjJw2DROgQJO7xRBDsp1Q8anoQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/re-2bef82ff5a724ccdbceb327e577ebb8b.jpg"
  },
  { 
    text: "Would you rather be part of a small tight-knit group or a large vibrant community?", 
    left: "Small Circle, Deep Bonds", 
    right: "Big Community, Many Connections",
    leftImage: "https://images.stockcake.com/public/7/f/2/7f22d493-6fea-4a9d-b9f4-eadb3ba24473_large/intimate-group-gathering-stockcake.jpg",
    rightImage: "https://snworksceo.imgix.net/pri/52c9d477-7d34-4fc4-9100-319d4ab06e06.sized-1000x1000.jpg?w=1000"
  }
];

const Preferences = () => {
  const [index, setIndex] = useState(0);
  const [preferences, setPreferences] = useState([]);
  const navigate = useNavigate();

  const handleSwipe = (choice) => {
    setPreferences([...preferences, choice]);

    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      console.log("Preferences Saved:", preferences);

      navigate("/community"); // Redirect to recommendations page
    }
  };

  return (
    <div className="preferences-container">
      <div className="card">
        <p className="question-text">{questions[index].text}</p>
        <div className="swipe-buttons">
          <button 
            className="option-btn left-btn" 
            onClick={() => handleSwipe("Left")}
            style={{ backgroundImage: `url(${questions[index].leftImage})` }}
          >
            <div className="overlay"></div>
            <span className="spann">{questions[index].left}</span>
          </button>

          <button 
            className="option-btn right-btn" 
            onClick={() => handleSwipe("Right")}
            style={{ backgroundImage: `url(${questions[index].rightImage})` }}
          >
            <div className="overlay"></div>
            <span className="spann">{questions[index].right}</span>
          </button>
          
        </div>
      </div><br/>
    </div>
  );
};

export default Preferences;
