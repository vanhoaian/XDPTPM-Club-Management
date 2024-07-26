package vnua.k66cnpma.clubmanagement.commons.suberror;

import lombok.Getter;
@Getter
public class ApiMessageError implements ApiSubError {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private final String errorMessage;

    public ApiMessageError(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
