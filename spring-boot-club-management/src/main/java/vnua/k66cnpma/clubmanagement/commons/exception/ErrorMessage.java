package vnua.k66cnpma.clubmanagement.commons.exception;

import java.io.Serializable;

public interface ErrorMessage extends Serializable {
    int getCode();

    String getMessage();
}
