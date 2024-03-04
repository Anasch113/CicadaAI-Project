import './Features.css'
import mic from '../../assets/icons/mic.png';
import check from '../../assets/icons/check.png';
import calc from '../../assets/icons/calc.png';
import notes from '../../assets/icons/notes.png';
import security from '../../assets/icons/security.png';
import smile from '../../assets/icons/smile.png';
import 'aos/dist/aos.css';

const Features = () => {
    const animationEffects = [
        'fade-up',
        'fade-down',
        'flip-up',
        'flip-down',
        'flip-left',
        'flip-right',
        'slide-up',
        'slide-down',
      ];

      const getRandomAnimationEffect = (index) => {
        const effectsLength = animationEffects.length;
        const effectIndex = index % effectsLength;
        return animationEffects[effectIndex];
      };
      
    const featuresData = [
        {
          id: 1,
          title: 'Easy Dictation',
          description: 'Natural dictation input using mobile or desktop.',
          imageUrl: mic, // Replace with actual image path
        },
        {
          id: 2,
          title: 'High Accuracy',
          description: 'High accuracy cloud speech to text recognitions.',
          imageUrl: check, // Replace with actual image path
        },
        {
          id: 3,
          title: 'AI Magic',
          description: 'AI processing using specialized prompt engineering.',
          imageUrl: calc, // Replace with actual image path
        },
        {
          id: 4,
          title: 'Structured Notes',
          description: 'Well structured notes with one-click copy function.',
          imageUrl: notes, // Replace with actual image path
        },
        {
          id: 5,
          title: 'Secured',
          description: 'Secure and Encrypted.',
          imageUrl: security, // Replace with actual image path
        },
        {
          id: 6,
          title: 'Easy to use',
          description: 'An easy-to-follow interface.',
          imageUrl: smile, // Replace with actual image path
        },
      ];
    
      return (
        <div className="features-container">
          <h2 className="text-center">Useful Features</h2>
          <div className="features-cards">
            {featuresData.map((feature) => (
              <div key={feature.id} className="feature-card"               data-aos={getRandomAnimationEffect(feature.id)}
              data-aos-duration="1000">
                <img src={feature.imageUrl} alt={feature.title} />
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
    );
};

export default Features;