import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '../../hooks/useDebounce';
import { searchCities } from '../../services/weatherApi';
import styles from './SearchBar.module.css';

export function SearchBar({ onCitySelect, onUseLocation, locationLoading }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    async function fetchSuggestions() {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const results = await searchCities(debouncedQuery);
        setSuggestions(results);
        setSelectedIndex(-1);
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSuggestions();
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(city) {
    onCitySelect(city.name);
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.blur();
  }

  function handleKeyDown(e) {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter' && query.trim()) {
        onCitySelect(query.trim());
        setQuery('');
        setShowSuggestions(false);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(suggestions[selectedIndex]);
        } else if (query.trim()) {
          onCitySelect(query.trim());
          setQuery('');
          setShowSuggestions(false);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <motion.div
        className={`${styles.searchBox} ${isFocused ? styles.focused : ''}`}
        animate={{ scale: isFocused ? 1.02 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className={styles.iconWrapper}>
          <motion.svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            animate={{ scale: loading ? 0.9 : 1 }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </motion.svg>
          {loading && <div className={styles.loadingRing} />}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            setShowSuggestions(true);
            setIsFocused(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search location..."
          className={styles.input}
          aria-label="Search for a city"
          aria-expanded={showSuggestions && suggestions.length > 0}
        />

        <div className={styles.actions}>
          <motion.button
            className={styles.locationBtn}
            onClick={onUseLocation}
            disabled={locationLoading}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Use my location"
          >
            {locationLoading ? (
              <div className={styles.spinner} />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                <circle cx="12" cy="12" r="8" strokeDasharray="4 4" opacity="0.4" />
              </svg>
            )}
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.dropdownHeader}>
              <span className={styles.dropdownLabel}>Locations</span>
              <span className={styles.dropdownCount}>{suggestions.length}</span>
            </div>
            <ul className={styles.suggestionList}>
              {suggestions.map((city, index) => (
                <motion.li
                  key={`${city.lat}-${city.lon}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <button
                    className={`${styles.suggestion} ${index === selectedIndex ? styles.selected : ''}`}
                    onClick={() => handleSelect(city)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className={styles.suggestionIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div className={styles.suggestionContent}>
                      <span className={styles.cityName}>{city.name}</span>
                      <span className={styles.cityRegion}>
                        {city.state ? `${city.state}, ` : ''}{city.country}
                      </span>
                    </div>
                    <div className={styles.suggestionArrow}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
