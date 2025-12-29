package ru.walkername.feed_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PostRequest {

    @NotBlank
    @Size(min = 5, max = 50)
    private String title;

    @NotBlank
    @Size(min = 5, max = 500)
    private String content;

}
