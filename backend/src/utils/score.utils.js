// utils/score.util.js

exports.calculateEngagementScore = (reel) => {

    const watchRatio =
        reel.viewsCount > 0
            ? reel.watchTimeTotal / reel.viewsCount
            : 0;

    return (
        (reel.likesCount * 2) +
        (reel.commentsCount * 4) +
        (reel.sharesCount * 5) +
        (reel.savesCount * 3) +
        (watchRatio * 6)
    );
};

exports.calculateConversionScore = ({
    restaurantRating = 0,
    userOrdersFromRestaurant = 0,
    distanceScore = 0
}) => {

    return (
        (restaurantRating * 3) +
        (userOrdersFromRestaurant * 5) +
        (distanceScore * 2)
    );
};

exports.calculateFinalScore = (engagementScore, conversionScore, mode = "hybrid") => {

    let alpha = 0.6;
    let beta = 0.4;

    if (mode === "entertainment") {
        alpha = 0.8;
        beta = 0.2;
    }

    if (mode === "conversion") {
        alpha = 0.3;
        beta = 0.7;
    }

    return (engagementScore * alpha) + (conversionScore * beta);
};