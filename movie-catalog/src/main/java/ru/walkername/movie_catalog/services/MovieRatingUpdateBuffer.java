package ru.walkername.movie_catalog.services;

import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MovieRatingUpdateBuffer {

    private final Set<Long> dirtyMovies = ConcurrentHashMap.newKeySet();

    public void markDirty(Long id) {
        dirtyMovies.add(id);
    }

    public Set<Long> drainDirtyMovies() {
        Set<Long> copy = new HashSet<>(dirtyMovies);
        dirtyMovies.clear();
        return copy;
    }

}
