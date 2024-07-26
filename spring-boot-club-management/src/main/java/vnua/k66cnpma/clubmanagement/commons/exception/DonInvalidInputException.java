package vnua.k66cnpma.clubmanagement.commons.exception;

import lombok.Getter;
import vnua.k66cnpma.clubmanagement.commons.suberror.ApiSubError;

import java.util.Collections;
import java.util.List;

@Getter
public class DonInvalidInputException extends DonException {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private final transient List<ApiSubError> apiSubErrors;

    public DonInvalidInputException(ErrorMessage message, ApiSubError apiSubError) {
        super(message);
        this.apiSubErrors = Collections.singletonList(apiSubError);
    }

    public DonInvalidInputException(ErrorMessage message, List<ApiSubError> apiSubErrors) {
        super(message);
        this.apiSubErrors = apiSubErrors;
    }
}
