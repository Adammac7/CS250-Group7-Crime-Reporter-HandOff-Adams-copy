package com.sdsucrimereporter.dbapi.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UuidGenerator;
import lombok.Data;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
@Table(name = "reporters")
public class Reporter {

    @Id // primary key
    @UuidGenerator // auto generate unique IDs
    @Column(name = "id", unique = true, updatable = false)
    private String id;

    // unique = true: no same shit -- nullable = false: field is required
    @Column(name = "red_id", unique = true, nullable = false)
    private String redID;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(name = "sdsu_email", unique = true, nullable = false)
    private String sdsuEmail;

    // Changed password datatype from int to String for Bcrypt Hash
    @Column(nullable = false)
    private String password;

    public String getRedID() {
        return redID;
    }

}
