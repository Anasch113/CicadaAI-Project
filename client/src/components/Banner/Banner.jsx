import "./Banner.css";

const Banner = () => {
    return (
        <div className="banner">
            <div className="content">
                <h1 className="gradient-heading">AI medical summary</h1>
                <p>
                    Easy creation of medical summary with help of Speech
                    recognition model and Artificial intelligence.
                </p>
                <button>Get Early Access</button>
                <div className="banner-img">
                    <img
                        className="img-fluid w-100"
                        src="https://buildingpoint.com.au/wp-content/uploads/2021/09/Security_Trimble-Connect-1030x765.png"
                    />
                </div>
            </div>
        </div>
    );
};

export default Banner;
