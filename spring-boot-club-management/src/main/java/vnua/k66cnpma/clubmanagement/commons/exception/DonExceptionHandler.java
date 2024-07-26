package vnua.k66cnpma.clubmanagement.commons.exception;

import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.NoHandlerFoundException;
import vnua.k66cnpma.clubmanagement.commons.DonResponse;
import vnua.k66cnpma.clubmanagement.commons.suberror.ApiSubError;
import vnua.k66cnpma.clubmanagement.commons.suberror.ApiValidatorError;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Order(Ordered.HIGHEST_PRECEDENCE)
@ControllerAdvice
@Slf4j
public class DonExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<DonResponse<String>> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        log.info("handleMethodArgumentNotValid");

        List<ApiSubError> details = new ArrayList<>();
        ex.getBindingResult().getAllErrors()
                .forEach(error -> {
                    String fieldName = ((FieldError) error).getField();
                    Object rejectValue = ((FieldError) error).getRejectedValue();
                    String message = error.getDefaultMessage();

                    details.add(new ApiValidatorError(fieldName, rejectValue, message));
                });
        return new ResponseEntity<>(DonResponse.build(ErrorMessages.INVALID_VALUE, details), HttpStatus.OK);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    protected ResponseEntity<DonResponse<String>> handleConstraintViolationException(ConstraintViolationException ex) {
        log.info("handleConstraintViolationException. Message = {}", ex.getMessage(), ex);
        return new ResponseEntity<>(DonResponse.build(ex.getMessage(), HttpStatus.BAD_REQUEST.value()), HttpStatus.OK);
    }


    @ExceptionHandler(HttpMessageNotReadableException.class)
    protected ResponseEntity<DonResponse<String>> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        log.info("handleHttpMessageNotReadable. Message = {}", ex.getMessage(), ex);
        DonInvalidInputException exception = (DonInvalidInputException) ex.getCause().getCause();
        return new ResponseEntity<>(DonResponse.build(exception.getErrMsg(), exception.getApiSubErrors()), HttpStatus.OK);
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    protected ResponseEntity<DonResponse<String>> handleNoHandlerFoundException(NoHandlerFoundException ex) {
        log.info("handleNoHandlerFoundException. Message = {}", ex.getMessage(), ex);
        return new ResponseEntity<>(DonResponse.build(ErrorMessages.NOT_FOUND), HttpStatus.OK);
    }

    @ExceptionHandler(DonException.class)
    protected ResponseEntity<DonResponse<String>> handleOctException(DonException ex) {
        log.info("handleOctException. Msg = {}", ex.getErrMsg().getMessage(), ex);
        return buildResponseEntity(ex);
    }

    @ExceptionHandler(DonEntityNotFoundException.class)
    protected ResponseEntity<DonResponse<String>> handleOctEntityNotFound(DonEntityNotFoundException ex) {
        log.info("handleOctEntityNotFound. Msg = {}", ex.getErrMsg().getMessage(), ex);
        return new ResponseEntity<>(DonResponse.build(ex.getErrMsg(), Collections.singletonList(ex.getApiMessageError())), HttpStatus.OK);
    }

    @ExceptionHandler(DonInvalidInputException.class)
    protected ResponseEntity<DonResponse<String>> handleInvalidInputRequest(DonInvalidInputException ex) {
        log.info("handleInvalidInputRequest. Msg = {}", ex.getErrMsg().getMessage(), ex);
        return new ResponseEntity<>(DonResponse.build(ex.getErrMsg(), ex.getApiSubErrors()), HttpStatus.OK);
    }

    private ResponseEntity<DonResponse<String>> buildResponseEntity(DonException ex) {
        return new ResponseEntity<>(DonResponse.buildApplicationException(ex), HttpStatus.OK);
    }
}
