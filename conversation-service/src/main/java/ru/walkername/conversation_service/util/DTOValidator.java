package ru.walkername.conversation_service.util;

import lombok.experimental.UtilityClass;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.List;
import java.util.function.Function;

@UtilityClass
public class DTOValidator {

    public static void validate(
            BindingResult bindingResult,
            Function<String, ? extends RuntimeException> exceptionFunction
    ) {
        if (bindingResult.hasErrors()) {
            StringBuilder errorMsg = new StringBuilder();
            List<FieldError> errors = bindingResult.getFieldErrors();
            for (FieldError error : errors) {
                errorMsg.append(error.getField())
                        .append(" - ")
                        .append(error.getDefaultMessage())
                        .append(";");
            }

            throw exceptionFunction.apply(errorMsg.toString());
        }
    }

}
