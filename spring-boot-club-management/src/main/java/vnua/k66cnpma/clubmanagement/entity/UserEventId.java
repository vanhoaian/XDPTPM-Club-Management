package vnua.k66cnpma.clubmanagement.entity;

import java.io.Serializable;
import java.util.Objects;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserEventId implements Serializable {
    private static final long serialVersionUID = 1L;
	private String username;
    private String idEvent;

    @Override
    public boolean equals(Object o) {
        // Kiểm tra nếu tham chiếu đối tượng giống nhau (cùng tham chiếu)
        if (this == o) return true;
        
        // Kiểm tra nếu đối tượng so sánh là null hoặc không phải cùng loại
        if (o == null || getClass() != o.getClass()) return false;
        
        // Chuyển đổi đối tượng sang kiểu UserEventId để so sánh thuộc tính
        UserEventId that = (UserEventId) o;
        
        // So sánh thuộc tính để kiểm tra tính đồng nhất
        return Objects.equals(username, that.username) &&
               Objects.equals(idEvent, that.idEvent);
    }

    @Override
    public int hashCode() {
        // Tạo mã băm dựa trên các thuộc tính
        return Objects.hash(username, idEvent);
    }
}
