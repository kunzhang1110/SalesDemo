using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalesDemo.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalesDemo.Controllers
{
    [Route("api/[controller]")]
    public class StoreController : Controller
    {
        private readonly ApplicationDbContext _context;
        public StoreController(ApplicationDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Store>>> Get()
        {
            var Stores = await _context.Stores.ToListAsync();
            if (Stores.Count == 0)
            {
                Stores.Add(new Store());
            }
            return Stores;
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Store>> Get(int id)
        {
            var Store = await _context.Stores.Where(c => c.Id == id).SingleOrDefaultAsync();
            if (Store == null)
            {
                return NotFound();
            }
            return Store;
        }

        // POST api/<controller>
        [HttpPost]
        public async Task<ActionResult<Store>> Post([FromBody]Store Store)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            _context.Stores.Add(Store);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Store), Store);

        }

        // PUT api/<controller>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Store>> Put(int id, [FromBody]Store Store)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var StoreInDb = await _context.Stores.Where(c => c.Id == id).SingleOrDefaultAsync();
            if (StoreInDb == null)
            {
                return NotFound();
            }

            StoreInDb.Name = Store.Name;
            StoreInDb.Address = Store.Address;
            StoreInDb.Sale = Store.Sale;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE api/<controller>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Store>> Delete(int id)
        {
            var Store = await _context.Stores.Where(c => c.Id == id).SingleOrDefaultAsync();
            _context.Stores.Remove(Store);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
