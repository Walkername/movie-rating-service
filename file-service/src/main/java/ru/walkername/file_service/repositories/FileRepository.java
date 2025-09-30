package ru.walkername.file_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.walkername.file_service.models.File;

@Repository
public interface FileRepository extends JpaRepository<File, Long> {
}
