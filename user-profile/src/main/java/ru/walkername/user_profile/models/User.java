package ru.walkername.user_profile.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.Date;

@Entity
@Table(name = "user_profile")
public class User {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "Username should not be empty")
    @Size(min = 5, max = 20, message = "Username should be greater than 5 and less than 20 characters")
    @Column(name = "username")
    private String username;

    @NotEmpty(message = "Password cannot be empty")
    @Size(min = 5, message = "Password should be greater than 5 characters")
    @Column(name = "password")
    private String password;

    @Column(name = "description")
    @Size(max = 500, message = "Description should be less than 500 characters")
    private String description;

    @Column(name = "profile_pic_id")
    private Long profilePicId;

    @Column(name = "average_rating")
    private double averageRating;

    @Column(name = "scores")
    private int scores;

    @Column(name = "role")
    private String role;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "updated_at")
    private Date updatedAt;

    public User() {

    }

    public User(String username, String password, String description, Long profilePicId, double averageRating, int scores, String role, Date createdAt, Date updatedAt) {
        this.username = username;
        this.password = password;
        this.description = description;
        this.profilePicId = profilePicId;
        this.averageRating = averageRating;
        this.scores = scores;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public int getScores() {
        return scores;
    }

    public void setScores(int scores) {
        this.scores = scores;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getProfilePicId() {
        return profilePicId;
    }

    public void setProfilePicId(Long profilePicId) {
        this.profilePicId = profilePicId;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
}
