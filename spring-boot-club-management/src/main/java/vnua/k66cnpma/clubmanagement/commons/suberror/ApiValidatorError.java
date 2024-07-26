package vnua.k66cnpma.clubmanagement.commons.suberror;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class ApiValidatorError implements ApiSubError {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String field;
    private Object rejectValue;
    private String message;
}
