package vnua.k66cnpma.clubmanagement.commons;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vnua.k66cnpma.clubmanagement.commons.exception.DonException;
import vnua.k66cnpma.clubmanagement.commons.exception.ErrorMessage;
import vnua.k66cnpma.clubmanagement.commons.suberror.ApiSubError;
import vnua.k66cnpma.clubmanagement.helper.DateHelper;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DonResponse<T> {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = DateHelper.GLOBAL_DATE_TIME)
    private LocalDateTime timestamp = LocalDateTime.now();
    private int code;
    private String message;
    private List<ApiSubError> details;
    private T data;
    private int total;

    public static <T> DonResponse<T> build(ErrorMessage errorMessage) {
        DonResponse<T> response = new DonResponse<>();
        response.code = errorMessage.getCode();
        response.message = errorMessage.getMessage();
        return response;
    }

    public static <T> DonResponse<T> build(ErrorMessage errorMessage, List<ApiSubError> details) {
        DonResponse<T> response = build(errorMessage);
        response.details = details;
        return response;
    }

    public static <T> DonResponse<T> build(T data) {
        DonResponse<T> response = new DonResponse<>();
        response.data = data;
        if (data instanceof Collection) {
            response.total = ((Collection<?>) data).size();
        }
        response.code = 200;
        return response;
    }

    public static <T> DonResponse<T> build(T data, Integer total) {
        DonResponse<T> response = build(data);
        response.total = total;
        return response;
    }

    public static <T> DonResponse<T> build(T data, ErrorMessage errorMessage) {
        DonResponse<T> response = build(errorMessage);
        response.data = data;
        return response;
    }

    public static <T> DonResponse<T> build(String message, Integer errCode) {
        DonResponse<T> response = new DonResponse<>();
        response.code = errCode;
        response.message = message;
        return response;
    }

    public static DonResponse<String> buildApplicationException(DonException exception) {
        return build(exception.getErrMsg());
    }
}
