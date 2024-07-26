package vnua.k66cnpma.clubmanagement.commons.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import vnua.k66cnpma.clubmanagement.commons.suberror.ApiMessageError;

@Getter
@AllArgsConstructor
public class DonEntityNotFoundException extends DonException{
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private final ApiMessageError apiMessageError;

    public DonEntityNotFoundException(ErrorMessage message, ApiMessageError apiMessageError) {
        super(message);
        this.apiMessageError = apiMessageError;
    }
}
