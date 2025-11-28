// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FeedbackLoop {
    // A single piece of feedback
    struct Feedback {
        address user;      // Who sent the feedback
        string comment;    // The feedback text
        uint8 rating;      // Rating from 1 to 5 (for example)
        uint256 timestamp; // When it was submitted
    }

    // Store all feedbacks in an array
    Feedback[] private feedbacks;

    // Event for off-chain listening (e.g. in a dApp UI)
    event FeedbackSubmitted(
        address indexed user,
        uint8 rating,
        string comment,
        uint256 timestamp
    );

    // 👉 No constructor params = no input fields during deployment
    constructor() {
        // You can leave this empty
    }

    /**
     * @dev Submit new feedback.
     * @param _comment Short text message with feedback.
     * @param _rating Number between 1 and 5.
     */
    function submitFeedback(string calldata _comment, uint8 _rating) external {
        require(_rating >= 1 && _rating <= 5, "Rating must be 1-5");

        Feedback memory newFeedback = Feedback({
            user: msg.sender,
            comment: _comment,
            rating: _rating,
            timestamp: block.timestamp
        });

        feedbacks.push(newFeedback);

        emit FeedbackSubmitted(msg.sender, _rating, _comment, block.timestamp);
    }

    /**
     * @dev Returns the total number of feedback entries.
     */
    function getFeedbackCount() external view returns (uint256) {
        return feedbacks.length;
    }

    /**
     * @dev Get a single feedback by index.
     */
    function getFeedback(uint256 _index)
        external
        view
        returns (
            address user,
            string memory comment,
            uint8 rating,
            uint256 timestamp
        )
    {
        require(_index < feedbacks.length, "Index out of range");
        Feedback storage fb = feedbacks[_index];
        return (fb.user, fb.comment, fb.rating, fb.timestamp);
    }

    /**
     * @dev (Optional) Get the average rating of all feedback.
     *      This is a simple example and loops over the whole array.
     */
    function getAverageRating() external view returns (uint256) {
        if (feedbacks.length == 0) {
            return 0;
        }

        uint256 sum = 0;
        for (uint256 i = 0; i < feedbacks.length; i++) {
            sum += feedbacks[i].rating;
        }
        return sum / feedbacks.length;
    }
}