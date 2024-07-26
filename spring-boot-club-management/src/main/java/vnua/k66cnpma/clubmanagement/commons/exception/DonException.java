package vnua.k66cnpma.clubmanagement.commons.exception;

import lombok.Getter;

@Getter
public class DonException extends RuntimeException{
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private final ErrorMessage errMsg;

    public DonException(ErrorMessage errMsg) {
        super();
        this.errMsg = errMsg;
    }

    public DonException() {
        super();
        errMsg = null;
    }
}
